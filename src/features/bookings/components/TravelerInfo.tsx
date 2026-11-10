import { Mail, Phone, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";

interface TravelerInfoProps {
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
}

const plural = (n: number, singular: string, pluralForm: string) => `${n} ${n === 1 ? singular : pluralForm}`;

export function TravelerInfo({ name, email, phone, adults, children }: TravelerInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-foreground-muted">Lead traveler</p>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <Mail aria-hidden className="size-4 text-foreground-muted" />
          <span className="sr-only">Email:</span>
          <a href={`mailto:${email}`} className="text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">
            {email}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Phone aria-hidden className="size-4 text-foreground-muted" />
          <span className="sr-only">Phone:</span>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">
            {phone}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Users aria-hidden className="size-4 text-foreground-muted" />
          <span className="sr-only">Travelers:</span>
          {plural(adults, "adult", "adults")}
          {children > 0 && `, ${plural(children, "child", "children")}`}
        </li>
      </ul>
    </div>
  );
}