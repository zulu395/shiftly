import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PopulatedEmployee } from "@/types/employee";
import { TiContacts } from "react-icons/ti";
import DataTableRow from "./DataTableRow";

type DataTableProps = {
  data: PopulatedEmployee[];
};

export default function DataTable({ data }: DataTableProps) {
  if (data.length === 0) return <EmptyComponent />;

  return (
    <div className="py-4 w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone no.</TableHead>
            <TableHead>Job title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((contact, index) => (
            <DataTableRow key={index} data={contact} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyComponent() {
  return (
    <div className="min-h-[70vh] justify-center items-center flex">
      <div className="w-full max-w-[560px] flex flex-col gap-6  items-center justify-center text-center text-pretty">
        <h2 className="text-7xl text-brand-primary">
          <TiContacts />
        </h2>
        <h3 className="h3 font-semibold">
          Stay organized as you build relationships
        </h3>
        <p className="h5 font-medium text-gray-600">
          Contacts are automatically created and updated when a Calendly meeting
          is booked. View meeting history, access key details, and schedule your
          next conversation — all in one place.
        </p>
      </div>
    </div>
  );
}
