import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check for hash fragment-style access token (common in OAuth redirects)
    // This happens when Supabase redirects with URL fragments instead of query params
    const hash = requestUrl.hash || (request.headers.get('referer') || '').split('#')[1];
    
    if (hash && hash.includes('access_token')) {
      // Extract the code from hash fragment
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        // Set the session manually using the access token
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: params.get('refresh_token') || '',
        });
        
        if (error) {
          console.error('Error setting session:', error);
          return NextResponse.redirect(`${requestUrl.origin}/login?error=AuthError`);
        }
        
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      }
    }
    
    // Standard code exchange flow
    const code = requestUrl.searchParams.get('code');
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }
    
    // If neither code nor access_token is present
    console.error('No code or access token provided');
    return NextResponse.redirect(`${requestUrl.origin}/login?error=MissingAuthParams`);
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=AuthenticationFailed`
    );
  }
}
