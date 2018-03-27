import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONObject;

@ServerEndpoint(value="/board/{username}")
public class BoardEndpoint {
	
	private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
	private static HashMap<String, String> users = new HashMap<>();
	
	@OnOpen
	public void onOpen(Session session, @PathParam("username") String username) {
		clients.add(session);
		users.put(session.getId(), username);
		System.out.println(users);
	}
	
	@OnClose
	public void onClose(Session session) throws IOException {
		JSONObject json = new JSONObject();
		String msg = "Username: " + users.get(session.getId()) + " has left the drawing room.";
		json.put("status", 200).put("message", msg);
		users.remove(session.getId());
		clients.remove(session);
		broadcast(json.toString());
	}
	
	/*MÉTODO PARA HACER BROADCAST A TODOS LOS USUARIOS CONECTADOS AL WEBSOCKET. SE DEBERÍA ENVIAR UN OBJETO CON COORDENADAS Y COLOR DE CADA USUARIO*/
	public static void broadcast(String message) throws IOException {
		synchronized (clients) {
			for (Session client : clients) {
				client.getBasicRemote().sendText(message);
			}
		}
	}
	
}
