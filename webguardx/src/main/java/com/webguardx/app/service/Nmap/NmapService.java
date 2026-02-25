package com.webguardx.app.service.Nmap;

import com.webguardx.app.config.NmapConfig;
import com.webguardx.app.model.Nmap.*;
import com.webguardx.app.model.ScanHistory;
import com.webguardx.app.model.User;
import com.webguardx.app.repository.ScanHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NmapService {

    private static final Logger logger = LoggerFactory.getLogger(NmapService.class);

    @Autowired
    private NmapConfig nmapConfig;

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    public NmapScanResult scan(NmapScanRequest request, User user) {
        long startTime = System.currentTimeMillis();
        NmapScanResult result = new NmapScanResult();

        try {
            // Validate input
            if (request.getTarget() == null || request.getTarget().trim().isEmpty()) {
                return new NmapScanResult("ERROR", "Target cannot be null or empty");
            }

            // Check if nmap is available
            if (!isNmapAvailable()) {
                return new NmapScanResult("ERROR", "Nmap is not available at path: " + nmapConfig.getNmapPath());
            }

            // Build nmap command based on features
            List<String> command = buildNmapCommand(request);

            logger.info("Executing nmap command: {}", String.join(" ", command));

            // Execute nmap scan
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            // Read output
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                    logger.debug("nmap output: {}", line);
                }
            }

            // Wait for process to complete with timeout
            boolean completed = process.waitFor(nmapConfig.getScanTimeout(), TimeUnit.MILLISECONDS);

            if (!completed) {
                process.destroyForcibly();
                return new NmapScanResult("ERROR", "Scan timed out after " + nmapConfig.getScanTimeout() + "ms");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                logger.error("Nmap scan failed with exit code: {}", exitCode);
                return new NmapScanResult("ERROR", "Nmap scan failed with exit code: " + exitCode);
            }

            // Parse the XML output
            result = parseNmapXmlOutput(output.toString(), request.getTarget());
            result.setStatus("SUCCESS");
            result.setMessage("Scan completed successfully");
            result.setRawOutput(output.toString());

            // Save to history
            saveScanHistory(result, user, request);

        } catch (Exception e) {
            logger.error("Nmap scan failed: {}", e.getMessage(), e);
            result = new NmapScanResult("ERROR", "Scan failed: " + e.getMessage());
        }

        result.setScanDuration(System.currentTimeMillis() - startTime);
        return result;
    }

    private List<String> buildNmapCommand(NmapScanRequest request) {
        List<String> command = new ArrayList<>();

        // Add nmap path
        command.add(nmapConfig.getNmapPath());

        // Add scan speed (T1-T5)
        command.add("-T" + request.getScanSpeed());

        // Add basic scan options
        if (request.isQuickScan()) {
            command.add("-F"); // Fast scan (limited ports)
        } else if (request.isFullScan()) {
            command.add("-p-"); // All ports
        } else if (request.getCustomPorts() != null && !request.getCustomPorts().isEmpty()) {
            command.add("-p" + request.getCustomPorts());
        }

        // OS Detection
        if (request.isOsDetection()) {
            command.add("-O");
            command.add("--osscan-guess");
        }

        // Version Detection
        if (request.isVersionDetection()) {
            command.add("-sV");
            command.add("--version-intensity");
            command.add("7");
        }

        // UDP Scan
        if (request.isUdpScan()) {
            command.add("-sU");
        }

        // Default to TCP SYN scan
        if (!request.isUdpScan()) {
            command.add("-sS");
        }

        // Vulnerability Scan
        if (request.isVulnerabilityScan()) {
            command.add("--script");
            command.add("vuln");
        }

        // SSL/TLS Testing
        if (request.isSslTest()) {
            command.add("--script");
            command.add("ssl-enum-ciphers,ssl-heartbleed,ssl-poodle,ssl-ccs-injection,ssl-dh-params");
        }

        // Brute Force Detection
        if (request.isBruteForceCheck()) {
            command.add("--script");
            command.add("brute");
        }

        // Firewall/IDS Evasion
        if (request.isFirewallEvasion()) {
            command.add("-f");
            command.add("--mtu");
            command.add("24");
            command.add("-D");
            command.add("RND:10");
            command.add("--source-port");
            command.add("53");
            command.add("--data-length");
            command.add("200");
            command.add("--randomize-hosts");
        }

        // Add output format for easier parsing
        command.add("-oX");
        command.add("-");

        // Add target
        command.add(request.getTarget());

        return command;
    }

    private NmapScanResult parseNmapXmlOutput(String xmlOutput, String target) {
        NmapScanResult result = new NmapScanResult();
        result.setTarget(target);

        // Initialize all lists
        result.setOpenPorts(new ArrayList<>());
        result.setFilteredPorts(new ArrayList<>());
        result.setClosedPorts(new ArrayList<>());
        result.setVulnerabilities(new ArrayList<>());
        result.setDetectedServices(new ArrayList<>());
        result.setDiscoveredDevices(new ArrayList<>());
        result.setBruteForceRisks(new ArrayList<>());
        result.setMisconfigurations(new ArrayList<>());
        result.setCveFindings(new ArrayList<>());

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new ByteArrayInputStream(xmlOutput.getBytes()));

            // Parse host information
            parseHostInfo(document, result);

            // Parse ports
            parsePorts(document, result);

            // Parse OS detection
            parseOsDetection(document, result);

            // Parse services
            parseServices(document, result);

            // Parse scripts output for vulnerabilities
            parseScripts(document, result);

        } catch (Exception e) {
            logger.error("Error parsing XML output: {}", e.getMessage());
        }

        // Run additional detections
        detectExposedDatabases(result);
        detectAnonymousFtp(result);
        detectCloudExposure(result, target);

        return result;
    }

    private void parseHostInfo(Document document, NmapScanResult result) {
        NmapHostInfo hostInfo = new NmapHostInfo();

        NodeList hostNodes = document.getElementsByTagName("host");
        if (hostNodes.getLength() > 0) {
            Element host = (Element) hostNodes.item(0);

            // Get status
            NodeList statusNodes = host.getElementsByTagName("status");
            if (statusNodes.getLength() > 0) {
                Element status = (Element) statusNodes.item(0);
                hostInfo.setStatus(status.getAttribute("state"));
            }

            // Get addresses
            NodeList addressNodes = host.getElementsByTagName("address");
            for (int i = 0; i < addressNodes.getLength(); i++) {
                Element address = (Element) addressNodes.item(i);
                String addrType = address.getAttribute("addrtype");
                String addr = address.getAttribute("addr");

                if ("ipv4".equals(addrType)) {
                    hostInfo.setIpAddress(addr);
                } else if ("mac".equals(addrType)) {
                    hostInfo.setMacAddress(addr);
                    hostInfo.setVendor(address.getAttribute("vendor"));
                }
            }

            // Get hostnames
            NodeList hostnameNodes = host.getElementsByTagName("hostname");
            if (hostnameNodes.getLength() > 0) {
                Element hostname = (Element) hostnameNodes.item(0);
                hostInfo.setHostname(hostname.getAttribute("name"));
            }
        }

        result.setHostInfo(hostInfo);
    }

    private void parsePorts(Document document, NmapScanResult result) {
        NodeList portNodes = document.getElementsByTagName("port");

        for (int i = 0; i < portNodes.getLength(); i++) {
            Element portElement = (Element) portNodes.item(i);

            String portId = portElement.getAttribute("portid");
            String protocol = portElement.getAttribute("protocol");

            // Get state
            NodeList stateNodes = portElement.getElementsByTagName("state");
            if (stateNodes.getLength() > 0) {
                Element state = (Element) stateNodes.item(0);
                String stateStr = state.getAttribute("state");

                NmapPort port = new NmapPort();
                port.setPort(Integer.parseInt(portId));
                port.setProtocol(protocol);
                port.setState(stateStr);

                // Get service info
                NodeList serviceNodes = portElement.getElementsByTagName("service");
                if (serviceNodes.getLength() > 0) {
                    Element service = (Element) serviceNodes.item(0);
                    port.setService(service.getAttribute("name"));
                    port.setProduct(service.getAttribute("product"));
                    port.setVersion(service.getAttribute("version"));
                    port.setExtraInfo(service.getAttribute("extrainfo"));

                    // Add to detected services
                    NmapServiceInfo serviceInfo = new NmapServiceInfo();
                    serviceInfo.setPort(Integer.parseInt(portId));
                    serviceInfo.setName(service.getAttribute("name"));
                    serviceInfo.setProduct(service.getAttribute("product"));
                    serviceInfo.setVersion(service.getAttribute("version"));
                    serviceInfo.setProtocol(protocol);
                    result.getDetectedServices().add(serviceInfo);
                }

                // Add to appropriate list based on state
                switch (stateStr) {
                    case "open":
                        result.getOpenPorts().add(port);
                        break;
                    case "filtered":
                        result.getFilteredPorts().add(port);
                        break;
                    case "closed":
                        result.getClosedPorts().add(port);
                        break;
                }
            }
        }

        // Update host info counts
        if (result.getHostInfo() != null) {
            result.getHostInfo().setOpenPorts(result.getOpenPorts().size());
            result.getHostInfo().setFilteredPorts(result.getFilteredPorts().size());
            result.getHostInfo().setClosedPorts(result.getClosedPorts().size());
            result.getHostInfo().setTotalPorts(
                    result.getOpenPorts().size() +
                            result.getFilteredPorts().size() +
                            result.getClosedPorts().size()
            );
        }
    }

    private void parseOsDetection(Document document, NmapScanResult result) {
        NodeList osNodes = document.getElementsByTagName("os");

        if (osNodes.getLength() > 0) {
            Element osElement = (Element) osNodes.item(0);
            NmapOsDetection osDetection = new NmapOsDetection();

            NodeList osMatchNodes = osElement.getElementsByTagName("osmatch");
            if (osMatchNodes.getLength() > 0) {
                Element osMatch = (Element) osMatchNodes.item(0);
                osDetection.setName(osMatch.getAttribute("name"));
                osDetection.setAccuracy(osMatch.getAttribute("accuracy") + "%");

                NodeList osClassNodes = osMatch.getElementsByTagName("osclass");
                List<NmapOsClass> osClasses = new ArrayList<>();

                for (int j = 0; j < osClassNodes.getLength(); j++) {
                    Element osClass = (Element) osClassNodes.item(j);
                    NmapOsClass nmapOsClass = new NmapOsClass();
                    nmapOsClass.setVendor(osClass.getAttribute("vendor"));
                    nmapOsClass.setOsFamily(osClass.getAttribute("osfamily"));
                    nmapOsClass.setOsGen(osClass.getAttribute("osgen"));
                    nmapOsClass.setType(osClass.getAttribute("type"));
                    nmapOsClass.setAccuracy(osClass.getAttribute("accuracy"));
                    osClasses.add(nmapOsClass);
                }

                osDetection.setOsClasses(osClasses);
            }

            result.setOsInfo(osDetection);
        }
    }

    private void parseServices(Document document, NmapScanResult result) {
        // Services are already parsed in parsePorts, this is just a placeholder
        // for any additional service-specific parsing
    }

    private void parseScripts(Document document, NmapScanResult result) {
        NodeList scriptNodes = document.getElementsByTagName("script");

        for (int i = 0; i < scriptNodes.getLength(); i++) {
            Element script = (Element) scriptNodes.item(i);
            String scriptId = script.getAttribute("id");
            String output = script.getAttribute("output");

            // Check for vulnerabilities
            if (output.contains("VULNERABLE")) {
                NmapVulnerability vuln = new NmapVulnerability();
                vuln.setName(scriptId);
                vuln.setDescription(output);
                vuln.setSeverity(output.contains("CRITICAL") ? "CRITICAL" :
                        output.contains("HIGH") ? "HIGH" : "MEDIUM");

                // Extract CVE if present
                Pattern cvePattern = Pattern.compile("CVE-(\\d{4}-\\d+)");
                Matcher cveMatcher = cvePattern.matcher(output);
                if (cveMatcher.find()) {
                    vuln.setCve(cveMatcher.group());
                }

                result.getVulnerabilities().add(vuln);
            }

            // Check for CVEs
            Pattern cvePattern = Pattern.compile("CVE-(\\d{4}-\\d+)");
            Matcher cveMatcher = cvePattern.matcher(output);
            while (cveMatcher.find()) {
                NmapCve cve = new NmapCve();
                cve.setId(cveMatcher.group());
                cve.setDescription("Detected by " + scriptId);
                cve.setSeverity("MEDIUM");
                result.getCveFindings().add(cve);
            }

            // Check for SSL/TLS info
            if (scriptId.startsWith("ssl-")) {
                parseSslScriptOutput(scriptId, output, result);
            }
        }
    }

    private void parseSslScriptOutput(String scriptId, String output, NmapScanResult result) {
        NmapSslInfo sslInfo = result.getSslInfo();
        if (sslInfo == null) {
            sslInfo = new NmapSslInfo();
            result.setSslInfo(sslInfo);
        }

        switch (scriptId) {
            case "ssl-heartbleed":
                sslInfo.setHeartbleedVulnerable(output.contains("VULNERABLE"));
                break;
            case "ssl-poodle":
                sslInfo.setPoodleVulnerable(output.contains("VULNERABLE"));
                break;
            case "ssl-enum-ciphers":
                if (output.contains("weak")) {
                    List<String> weakCiphers = sslInfo.getWeakCiphers();
                    if (weakCiphers == null) {
                        weakCiphers = new ArrayList<>();
                        sslInfo.setWeakCiphers(weakCiphers);
                    }
                    // Parse weak ciphers from output
                }
                break;
        }
    }

    private void detectExposedDatabases(NmapScanResult result) {
        List<Integer> databasePorts = Arrays.asList(3306, 5432, 27017, 6379, 9200, 9300, 1433, 1521, 9042);

        for (NmapPort port : result.getOpenPorts()) {
            if (databasePorts.contains(port.getPort())) {
                NmapMisconfiguration misconfig = new NmapMisconfiguration();
                misconfig.setType("Exposed Database");
                misconfig.setDescription("Database port " + port.getPort() + " (" + port.getService() + ") is exposed");
                misconfig.setImpact("Data breach, unauthorized access");
                misconfig.setRecommendation("Restrict database access with firewall rules");
                misconfig.setPort(port.getPort());
                misconfig.setService(port.getService());
                misconfig.setSeverity("CRITICAL");
                result.getMisconfigurations().add(misconfig);
            }
        }
    }

    private void detectAnonymousFtp(NmapScanResult result) {
        for (NmapPort port : result.getOpenPorts()) {
            if (port.getService().equalsIgnoreCase("ftp") && port.getPort() == 21) {
                NmapBruteForceRisk risk = new NmapBruteForceRisk();
                risk.setService("FTP");
                risk.setPort(21);
                risk.setRisk("MEDIUM");
                risk.setRecommendation("Check if anonymous FTP is enabled and disable if not needed");
                result.getBruteForceRisks().add(risk);
            }
        }
    }

    private void detectCloudExposure(NmapScanResult result, String target) {
        if (target.contains("amazonaws.com") ||
                target.contains("cloudfront.net") ||
                target.contains("azure.com") ||
                target.contains("cloud.google.com") ||
                target.contains("digitalocean.com")) {

            NmapMisconfiguration misconfig = new NmapMisconfiguration();
            misconfig.setType("Cloud Service Exposure");
            misconfig.setDescription("Cloud-hosted service detected - verify security groups");
            misconfig.setImpact("Potential misconfigured cloud security groups");
            misconfig.setRecommendation("Review cloud security group rules and implement least privilege");
            misconfig.setSeverity("MEDIUM");
            result.getMisconfigurations().add(misconfig);
        }

        List<Integer> cloudServicePorts = Arrays.asList(22, 3389, 5432, 3306, 27017, 9200);
        for (NmapPort port : result.getOpenPorts()) {
            if (cloudServicePorts.contains(port.getPort())) {
                NmapMisconfiguration misconfig = new NmapMisconfiguration();
                misconfig.setType("Cloud Service Port Exposure");
                misconfig.setDescription("Port " + port.getPort() + " (" + port.getService() + ") exposed to internet");
                misconfig.setImpact("Unauthorized access attempts, data exposure");
                misconfig.setRecommendation("Restrict access to this port using security groups");
                misconfig.setPort(port.getPort());
                misconfig.setService(port.getService());
                misconfig.setSeverity("HIGH");
                result.getMisconfigurations().add(misconfig);
            }
        }
    }

    private boolean isNmapAvailable() {
        try {
            Process process = new ProcessBuilder(nmapConfig.getNmapPath(), "--version").start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            logger.error("Nmap not available: {}", e.getMessage());
            return false;
        }
    }

    private void saveScanHistory(NmapScanResult result, User user, NmapScanRequest request) {
        try {
            ScanHistory history = new ScanHistory();
            history.setUserId(user.getId());
            history.setUserEmail(user.getEmail());
            history.setTargetUrl(request.getTarget());
            history.setActiveScan(true);
            history.setScannedAt(LocalDateTime.now());
            history.setStatus(result.getStatus());

            scanHistoryRepository.save(history);
        } catch (Exception e) {
            logger.error("Failed to save scan history: {}", e.getMessage());
        }
    }
}