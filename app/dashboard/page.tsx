import DashboardNavigation from "@/components/dashboard-navigation";
import Title from "@/components/title";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();
    
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        return redirect("/sign-in");
      }

    return (
        <>
            <DashboardNavigation dashboard pathname="/dashboard">
              <Title>Dashboard</Title>
            </DashboardNavigation>
            <div className="md:w-[980px] lg:w-[980px]">
                <p>Welcome to your dashboard.</p>
            </div>
        </>
    );
}