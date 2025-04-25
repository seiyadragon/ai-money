import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FinancialTable from "@/components/financial-table";
import Title from "@/components/title";
import DashboardNavigation from "@/components/dashboard-navigation";

export default async function DashboardExpensesPage() {
  const databaseTable = "NetworthData";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const {data, error} = await supabase.from(databaseTable)
                                      .select("*")
                                      .eq("user_id", user.id)
                                      .eq("deleted", false);

  let loadedUserData = []

  if (error) {
    console.error(error);
  } else {
    loadedUserData = data;
  }

  const {data: deletedData, error: deletedError} = await supabase.from(databaseTable)
                                                                  .select("*")
                                                                  .eq("user_id", user.id)
                                                                  .eq("deleted", true);

  let deletedUserData = []

  if (deletedError) {
    console.error(deletedError);
  } else {
    deletedUserData = deletedData;
  }
  
  return (
    <>
      <DashboardNavigation dashboard={false} pathname="/dashboard/networth">
        <Title>Net Worth</Title>
      </DashboardNavigation>
      <FinancialTable 
        entries={loadedUserData} 
        deletedEntries={deletedUserData} 
        databaseTable={databaseTable} 
      />
    </>
  );
}