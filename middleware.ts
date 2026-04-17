import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { canAccess, getDefaultPage, type UserProfile } from "@/lib/rbac";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  request.headers.set("x-pathname", pathname);
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoginPath = pathname === "/admin/login";

  const redirect = (dest: string) => {
    const url = request.nextUrl.clone();
    url.pathname = dest;
    const res = NextResponse.redirect(url);
    res.headers.set("x-pathname", dest);
    return res;
  };

  if (!user && !isLoginPath) return redirect("/admin/login");

  if (user) {
    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data: profile } = await adminClient
      .from("user_profiles")
      .select("user_id, role, permissions")
      .eq("user_id", user.id)
      .single();

    const userProfile = profile as UserProfile | null;

    if (isLoginPath) {
      const dest = userProfile ? getDefaultPage(userProfile) : "/admin/home";
      return redirect(dest);
    }

    if (!userProfile) {
      const dest = getDefaultPage({
        user_id: user.id,
        role: "employee",
        permissions: [],
      });
      if (pathname !== dest) return redirect(dest);
      return supabaseResponse;
    }

    if (!canAccess(userProfile, pathname)) {
      return redirect(getDefaultPage(userProfile));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
