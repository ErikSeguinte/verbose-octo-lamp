"use client";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import favicon from "@/assets/tomaketinylon_logo.jpg";

import classes from "./styles.module.css";

const links = [
  { label: "Events", link: "/events" },
  { label: "New Event", link: "/events/new" },
  { label: "About", link: "/about" },
  // { label: "User", link: `/users/${userId}` },
  // { label: "Community", link: "/community" },
];

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState("");

  const items = links.map((link) => (
    <Link
      className={classes.link}
      data-active={active === link.link || undefined}
      href={link.link}
      key={link.label}
      onClick={(_) => {
        _;
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container className={classes.inner} size="md">
        <Group>
          <Link
            className="no-underline"
            href="/"
            // eslint-disable-next-line no-unused-vars
            onClick={(_) => {
              setActive("");
            }}
          >
            <Image
              alt=""
              className="pr-1 w-auto"
              height={48}
              src={favicon}
              priority
            />
          </Link>
          <Link
            className="no-underline"
            href="/"
            // eslint-disable-next-line no-unused-vars
            onClick={(_) => {
              setActive("");
            }}
          >
            <h1 className="text-xxl font-bold text-slate-800 no-underline">
              Verbose Octo Lamp
            </h1>
          </Link>
        </Group>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger hiddenFrom="xs" opened={opened} size="sm" onClick={toggle} />
      </Container>
    </header>
  );
}
