import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { usePayment } from "@/features/payments/hooks/usePayments";
import { company } from "@/features/payments/lib/company";
import { formatDay, formatMoney } from "@/features/payments/lib/format";
import { methodLabels } from "@/features/payments/lib/methods";

const printCss = `
@media print {
  body * { visibility: hidden; }
  #invoice, #invoice * { visibility: visible; }
  #invoice { position: absolute; left: 0; top: 0; width: 100%; border: 0 !important; box-shadow: none !important; }
}
`;

export function PaymentInvoicePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: p, isLoading, error } = usePayment(id);

  if (isLoading) return <Skeleton className="mx-auto h-[600px] w-full max-w-3xl" />;

  if (error || !p) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold">Invoice not available</h2>
        <Button variant="outline" onClick={() => navigate("/admin/payments")}>
          Back to payments
        </Button>
      </div>
    );
  }

  if (p.status !== "paid" && p.status !== "refunded") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold">No invoice yet</h2>
        <p className="max-w-md text-sm text-foreground-muted">An invoice is available once the payment is paid.</p>
        <Button variant="outline" onClick={() => navigate(`/admin/payments/${p.id}`)}>
          Back to payment
        </Button>
      </div>
    );
  }

  const number = `INV-${p.id.replace("PAY-", "")}`;
  const travelers = `${p.adults} ${p.adults === 1 ? "adult" : "adults"}${
    p.children > 0 ? `, ${p.children} ${p.children === 1 ? "child" : "children"}` : ""
  }`;

  return (
    <div className="space-y-4">
      <style>{printCss}</style>

      <div className="mx-auto flex max-w-3xl items-center justify-between print:hidden">
        <Button variant="ghost" asChild>
          <Link to={`/admin/payments/${p.id}`}>
            <ArrowLeft className="size-4" aria-hidden /> Back to payment
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden /> Print / save as PDF
        </Button>
      </div>

      <article id="invoice" className="mx-auto max-w-3xl rounded-xl border border-border bg-white p-10 text-neutral-900">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-lg font-bold">{company.name}</p>
            {company.address.map((line) => (
              <p key={line} className="text-sm text-neutral-600">
                {line}
              </p>
            ))}
            <p className="text-sm text-neutral-600">{company.email}</p>
            <p className="text-sm text-neutral-600">{company.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-wide">INVOICE</p>
            <p className="text-sm text-neutral-600">{number}</p>
            <p className="mt-2 text-sm text-neutral-600">Issued {formatDay(p.date)}</p>
            <p className="mt-1 inline-block rounded border border-neutral-400 px-2 py-0.5 text-xs font-semibold uppercase">
              {p.status === "refunded" ? "Refunded" : "Paid"}
            </p>
          </div>
        </header>

        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Billed to</p>
          <p className="mt-1 font-medium">{p.customer}</p>
          <p className="text-sm text-neutral-600">{p.customerEmail}</p>
        </section>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 font-semibold">Description</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-200">
              <td className="py-3">
                <p className="font-medium">{p.tour}</p>
                <p className="text-neutral-600">
                  {p.destination} · Travel date {formatDay(p.travelDate)} · {travelers}
                </p>
                <p className="text-neutral-600">Booking {p.bookingId}</p>
              </td>
              <td className="py-3 text-right tabular-nums">{formatMoney(p.amount)}</td>
            </tr>
          </tbody>
        </table>

        <dl className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatMoney(p.amount)}</dd>
          </div>
          {p.refundedAmount > 0 && (
            <div className="flex justify-between">
              <dt>Refunded</dt>
              <dd className="tabular-nums">− {formatMoney(p.refundedAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-neutral-300 pt-2 text-base font-bold">
            <dt>Net paid</dt>
            <dd className="tabular-nums">{formatMoney(p.amount - p.refundedAmount)}</dd>
          </div>
        </dl>

        <footer className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
          Paid by {methodLabels[p.method]} · Reference {p.reference}. Thank you for traveling with us.
        </footer>
      </article>
    </div>
  );
}