import { NextResponse } from "next/server";

const spotifyAuthorizeUrl = "https://accounts.spotify.com/authorize";

export function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scopes = process.env.SPOTIFY_SCOPES;

  if (!clientId || !redirectUri || !scopes) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, or SPOTIFY_SCOPES",
    );
  }

  const authorizationUrl = new URL(spotifyAuthorizeUrl);
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authorizationUrl);
}
