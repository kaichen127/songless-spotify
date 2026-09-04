import { NextResponse } from "next/server";

const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const spotifyError = requestUrl.searchParams.get("error");

  if (spotifyError) {
    return NextResponse.json(
      { error: `Spotify authorization failed: ${spotifyError}` },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Spotify did not provide an authorization code." },
      { status: 400 },
    );
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI",
    );
  }

  const tokenResponse = await fetch(spotifyTokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const errorDetails = await tokenResponse.text();
    return NextResponse.json(
      { error: "Spotify token exchange failed.", details: errorDetails },
      { status: tokenResponse.status },
    );
  }

  const tokenData = await tokenResponse.json();

  return NextResponse.json({
    message: "Spotify authorization succeeded.",
    tokenType: tokenData.token_type,
    scope: tokenData.scope,
    expiresIn: tokenData.expires_in,
  });
}
