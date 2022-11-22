package org.gm.app.util;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@SuppressWarnings("unchecked")
public class APIJSONObject<K,V> {

	private JSONParser parser = new JSONParser();
	private JSONObject json = null;
	private JSONArray jsonArray = null;
	
	public void put(K key, V value) {
		json.put(key, value);
	}
	
	public V get(K key) {
		return (V)json.get(key);
	}
	
	public String toString() {
		return json.toString();
	}
	
	public String toJSONString() {
		return json.toJSONString();
	}

	public APIJSONObject() {
		json = new JSONObject();
	}

	public APIJSONObject(JSONObject json) {
		this.json = json;
	}
	
	public JSONObject getNativeJSON() {
		return json;
	}
	
	public boolean parse(String strObj)  {
		try {
			json = (JSONObject) parser.parse(strObj);
		} catch (ParseException e) {
			// TODO Create new APIParserException and function should through that exception
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean parseArray(String strObj)  {
		try {
			jsonArray = (JSONArray) parser.parse(strObj);
		} catch (ParseException e) {
			// TODO Create new APIParserException and function should through that exception
			e.printStackTrace();
			return false;
		}
		return true;
	}
}