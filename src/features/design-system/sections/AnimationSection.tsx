import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { CalendarDays, CreditCard, LayoutDashboard, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Panel, Section } from "@/features/design-system/components/Section";
import { Heading, NumericText, Text } from "@/components/ui/typography/Typography";

const timings = [
  { name: "Button interaction", ms: "120–180ms" },
  { name: "Tooltip", ms: "~120ms" },
  { name: "Dropdown", ms: "150–180ms" },
  { name: "Dialog", ms: "180–220ms" },
  { name: "Page transition", ms: "180–250ms" },
  { name: "Sidebar", ms: "220–280ms" },
];

function CountUp({ value, prefix = "" }: { value: number; prefix?: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <NumericText className="text-4xl">
      {prefix}
      {display.toLocaleString("en-US")}
    </NumericText>
  );
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Bookings", icon: CalendarDays },
  { label: "Customers", icon: Users },
  { label: "Payments", icon: CreditCard },
];

const pages = ["Overview", "Bookings", "Payments"];

export function AnimationSection() {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [replay, setReplay] = useState(0);

  return (
    <Section
      id="animation"
      title="Animation"
      description="Short, purposeful motion built on opacity and transform. It never delays an action, and it switches off when the OS asks for reduced motion."
    >
      <div className="flex items-center gap-2">
        <Text size="sm" color="muted">
          Reduced motion:
        </Text>
        <Badge variant={reduce ? "warning" : "neutral"}>{reduce ? "On (animations minimized)" : "Off"}</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Hover and tap">
          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Hover and press me
            </motion.button>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border bg-surface p-4 shadow-sm hover:border-accent/50 hover:shadow-md"
            >
              <Text weight="semibold">Lifting card</Text>
              <Text size="sm" color="muted">
                Subtle lift on hover
              </Text>
            </motion.div>
          </div>
        </Panel>

        <Panel title="Dropdown (scale + fade, ~160ms)">
          <div className="relative h-40">
            <Button variant="outline" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
              Toggle menu
            </Button>
            <AnimatePresence>
              {menuOpen && (
                <motion.ul
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  style={{ transformOrigin: "top left" }}
                  className="absolute left-0 top-12 w-44 rounded-lg border bg-surface p-1 shadow-lg"
                >
                  {["View", "Edit", "Duplicate"].map((item) => (
                    <li key={item} className="rounded-md px-3 py-2 text-sm hover:bg-surface-muted">
                      {item}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </Panel>

        <Panel title="Page transition (~200ms)">
          <div className="flex gap-2">
            {pages.map((p, i) => (
              <Button key={p} size="sm" variant={page === i ? "primary" : "outline"} onClick={() => setPage(i)}>
                {p}
              </Button>
            ))}
          </div>
          <div className="relative min-h-24 overflow-hidden rounded-lg border bg-background p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Heading level="h3">{pages[page]}</Heading>
                <Text color="muted">Content for the {pages[page].toLowerCase()} page.</Text>
              </motion.div>
            </AnimatePresence>
          </div>
        </Panel>

        <Panel title="Statistic count-up">
          <div key={replay} className="flex flex-wrap items-baseline gap-8">
            <div>
              <CountUp value={128450} prefix="$" />
              <Text size="sm" color="muted">
                Revenue
              </Text>
            </div>
            <div>
              <CountUp value={1284} />
              <Text size="sm" color="muted">
                Bookings
              </Text>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setReplay((r) => r + 1)}>
            Replay
          </Button>
        </Panel>

        <Panel title="Sidebar collapse (~250ms)">
          <Button size="sm" variant="outline" onClick={() => setCollapsed((c) => !c)} aria-pressed={collapsed}>
            {collapsed ? "Expand" : "Collapse"}
          </Button>
          <motion.aside
            initial={false}
            animate={{ width: collapsed ? 64 : 200 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden rounded-lg border bg-background p-2"
          >
            <ul className="space-y-1">
              {navItems.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold hover:bg-surface-muted">
                  <Icon className="size-4 shrink-0" />
                  <motion.span animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.15 }}>
                    {label}
                  </motion.span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </Panel>

        <Panel title="Timing guidelines">
          <ul className="divide-y text-sm">
            {timings.map((t) => (
              <li key={t.name} className="flex items-center justify-between py-2">
                <span>{t.name}</span>
                <span className="font-semibold tabular-nums text-foreground-muted">{t.ms}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  );
}