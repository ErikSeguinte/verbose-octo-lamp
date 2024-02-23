"use client"
import { useState } from 'react';
import { Burger, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './styles.module.css';
import favicon from "@/assets/tomaketinylon_logo.jpg";
import Image from "next/image"
import Link from "next/link"

const userId = 1
const links = [
  { link: '/events', label: 'Events' },
  { link: '/events/new', label: 'New Event' },
  { link: `/users/${userId}`, label: 'User' },
  { link: '/community', label: 'Community' },
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
      onClick={(event) => {
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
      <Image alt="" className="pr-1" height={48} src={favicon} />
      <Link href="/" onClick={(event)=> {setActive("")}}>
        <h1 className="text-xl font-bold">Verbose Octo Lamp</h1>
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