"use client";

import Avatar from "@/components/common/Avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { IContact } from "@/server/models/Contact";
import { useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import EditContactModal from "@/components/contacts/EditContactModal";
import DeleteContactModal from "@/components/contacts/DeleteContactModal";

type DataTableRowProps = {
  data: IContact;
};

export default function DataTableRow({ data }: DataTableRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="whitespace-nowrap flex items-center gap-2">
          <Avatar src="" alt={data.fullname} />
          {data.fullname}
        </TableCell>
        <TableCell>{data.email}</TableCell>
        <TableCell className="whitespace-nowrap">{data.phone}</TableCell>
        <TableCell>{data.jobTitle}</TableCell>
        <TableCell>{data.company}</TableCell>
        <TableCell>{data.linkedin}</TableCell>
        <TableCell>{data.timezone}</TableCell>
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

      <EditContactModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        contact={data}
      />
      <DeleteContactModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        contact={data}
      />
    </>
  );
}
