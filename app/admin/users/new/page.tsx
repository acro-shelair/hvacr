import UserEditor from "../UserEditor";

export const metadata = { title: "Invite User | HVACR Admin" };

export default function NewUserPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Invite User</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Send an invitation email to a new admin panel user
        </p>
      </div>
      <UserEditor mode={{ type: "new" }} />
    </div>
  );
}
