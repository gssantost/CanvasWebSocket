import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@ServerEndpoint("/paint/{username}")
public class SharedPaint {
	private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
	private static HashMap<String, String> users = new HashMap<>();
	private static JSONArray drawingHistory = new JSONArray();
	//private static JSONArray usersHistory = new JSONArray();
	
	@OnOpen
	public void onOpen(Session session, @PathParam("username") String username) throws IOException {
		clients.add(session);
		users.put(session.getId(), username);
		if (drawingHistory.length() > 0) {
			for (int i = 0; i < drawingHistory.length(); i++) {
				broadcast(drawingHistory.getJSONObject(i).toString());
			}
		}
		JSONObject data = new JSONObject();
		data.put("usrs", users);
		broadcast(data.toString());
	}
	
	@OnClose
	public void onClose(Session session) throws IOException {
		JSONObject data = new JSONObject();
		String msg = "Username: " + users.get(session.getId()) + " has left the drawing room.";
		data.put("status", 200).put("message", msg);
		users.remove(session.getId());
		clients.remove(session);
		broadcast(data.toString());
	}
	
	@OnMessage
	public void onMessage(Session session, String cords) throws IOException {
		JSONObject data = new JSONObject(cords);
		//JSONObject row = new JSONObject();
		//row.put("line", data);
		drawingHistory.put(data);
		broadcast(data.toString());
		System.out.println(data);
	}
	
	public static void broadcast(String response) throws IOException {
		synchronized(clients) {
			for (Session client: clients) {
				client.getBasicRemote().sendText(response);
			}
		}
	}
}
