import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon, Table } from "lucide-react";
import { redirect } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import TableEntry from "@/components/table-entry";
import FinancialTable from "@/components/financial-table";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const {data, error} = await supabase.from("UserData")
                                      .select("*")
                                      .eq("user_id", user.id)
                                      .eq("deleted", false);

  let loadedUserData = []

  if (error) {
    console.error(error);
  } else {
    loadedUserData = data;
  }

  const {data: deletedData, error: deletedError} = await supabase.from("UserData")
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
      <FinancialTable entries={loadedUserData} deletedEntries={deletedUserData}/>
    </>
  );
}
