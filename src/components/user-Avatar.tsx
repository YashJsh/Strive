import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

const UserAvatar = ({user}: {user: User}) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar>
        <AvatarImage
          src={user?.imageUrl ?? undefined}
          alt={user?.name?.charAt(0)}
        />
        <AvatarFallback className="capitalize">
          {user ? user.name : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500">
        {user ? user.name : "unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
