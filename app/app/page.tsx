import { Button, Container, Group, Text, Title } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import Image from "next/image";

import octolamp from "@/assets/octolamp.png";

import classes from "./HeroTitle.module.css";

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
            <Text className={classes.description} color="dimmed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare
              arcu dui vivamus arcu felis bibendum ut tristique et. Netus et
              malesuada fames ac turpis egestas maecenas pharetra.
            </Text>

            <Title mt="1rem" order={3}>
              A Law of Names utility
            </Title>

            <Group className={classes.controls}>
              <Button
                className={classes.control}
                gradient={{ from: "blue", to: "cyan" }}
                size="xl"
                variant="gradient"
              >
                Get started
              </Button>

              <Button
                className={classes.control}
                component="a"
                href="https://github.com/mantinedev/mantine"
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
