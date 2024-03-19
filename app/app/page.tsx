import { Button, Container, Group, Text, Title } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import octolamp from "@/assets/octolamp.png";

import classes from "./HeroTitle.module.css";

const GetStartedButton = React.forwardRef(function newButton(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { onClick, href }: any,
  ref,
) {
  return (
    <Button
      className={classes.control}
      component="a"
      gradient={{ from: "blue", to: "cyan" }}
      href={href}
      ref={ref as any}
      size="xl"
      variant="gradient"
      onClick={onClick}
    >
      Get started
    </Button>
  );
});

export default function HeroTitle() {
  return (
    <div className={classes.wrapper}>
      <div className="flex w-auto justify-center">
        <Group
          className="flex w-auto justify-center"
          justify="center"
          mah="200px"
          maw="1000px"
        >
          <Image
            alt="An octopus lamp"
            className="w-auto"
            height="400"
            src={octolamp}
            priority
          />
          <Container className={classes.inner} size={700}>
            <h1 className={classes.title}>Verbose Octolamp</h1>
            <h2 className="-5rem"> Yet another Group Scheduling App</h2>
            <Text c="dimmed" className={classes.description}>
              Verbose Octolamp is a utility designed from the ground up to help
              Law of Names Media organize our own projects by making it easier
              to schedule our diverse and myriad contributors across time and
              space.
            </Text>
            <Text c="dimmed" className={classes.description} mt="0.5rem">
              Mostly time.
            </Text>
            <Text c="dimmed" className={classes.description} mt="0.5rem">
              Usually.
            </Text>

            <Title mt="2rem" order={3}>
              A Law of Names utility
            </Title>

            <Group className={classes.controls}>
              <Link href="/events/new" legacyBehavior passHref>
                <GetStartedButton />
              </Link>

              <Button
                className={classes.control}
                component="a"
                href="https://github.com/ErikSeguinte/verbose-octo-lamp"
                leftSection={<IconBrandGithub size={20} />}
                size="xl"
                variant="default"
              >
                GitHub
              </Button>
            </Group>
          </Container>
        </Group>
      </div>
    </div>
  );
}
