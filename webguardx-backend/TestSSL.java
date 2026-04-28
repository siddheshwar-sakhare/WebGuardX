import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class TestSSL {
    public static void main(String[] args) {
        String host = "wic.walchandsangli.ac.in";
        int port = 443;
        try {
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            SSLSocket socket = (SSLSocket) factory.createSocket(host, port);
            socket.setEnabledProtocols(socket.getSupportedProtocols());
            socket.setEnabledCipherSuites(socket.getSupportedCipherSuites());
            socket.setSoTimeout(5000);
            socket.startHandshake();
            System.out.println("Handshake successful!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
