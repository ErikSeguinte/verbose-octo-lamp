"use client"
import { useState } from 'react';
import { Container, Group, Burger } from '@mantine/core';
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
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group>
      <Image src={favicon} alt="" height={48} className="pr-1" />
      <Link href="/" onClick={(event)=> {setActive("")}}>
        <h1 className="text-xl font-bold">Verbose Octo Lamp</h1>
        </Link>
      </Group>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}