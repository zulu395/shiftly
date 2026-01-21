"use client"

import Avatar from "@/components/common/Avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { PopulatedEmployee } from "@/types/employee";
import { LuPencil, LuTrash } from "react-icons/lu";
import EditEmployeeModal from "@/components/contacts/EditEmployeeModal";
import DeleteEmployeeModal from "@/components/contacts/DeleteEmployeeModal";
import { useState } from "react";

type DataTableRowProps = {
  data: PopulatedEmployee;
};

export default function DataTableRow({ data }: DataTableRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="whitespace-nowrap flex items-center gap-2">
          <Avatar
            src={data.account?.avatar}
            alt={data.dummyName}
          />
          {data.dummyName}

        </TableCell>
        <TableCell>{data.dummyEmail}</TableCell>
        <TableCell className="whitespace-nowrap">{data.account?.phone}</TableCell>
        <TableCell>{data.jobTitle}</TableCell>
        <TableCell>{data.company?.companyName}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${data.status === "invited"
              ? "bg-yellow-100 text-yellow-700"
              : data.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {data.status === "invited" ? "pending" : data.status}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end items-center gap-1">
            <button
              onClick={() => setEditOpen(true)}
              className="btn-icon text-gray-500 hover:text-brand-primary"
              title="edit"
            >
              <LuPencil />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="btn-icon text-gray-500 hover:text-red-500"
              title="delete"
            >
              <LuTrash />
            </button>
          </div>
        </TableCell>
      </TableRow>

      <EditEmployeeModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        employee={data}
      />
      <DeleteEmployeeModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        employee={data}
      />
    </>
  );
}
