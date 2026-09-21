export interface ClientInfo {
  client_id: string,
  client_name: string,
  client_uri: string,
  logo_uri: string
}

export async function loadIndieAuthClientInfo(client_id: string): Promise<ClientInfo> {
  try {
    const result = await fetch(client_id)
    const json = await result.json()
    return json as ClientInfo
  } catch (error) {
    console.error(error)
    return {
      client_id,
      client_name: "Unknown",
      client_uri: "#unknown",
      logo_uri: "#unknown"
    }
  }
}