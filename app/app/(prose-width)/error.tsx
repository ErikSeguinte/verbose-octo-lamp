/* eslint-disable no-console */
"use client";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useEffect } from "react";

import classes from "./error.module.css";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <Container className={classes.root}>
      <div className={classes.label}>500</div>
      <Title className={classes.title}>Someone broke something</Title>
      <Text c="dimmed" className={classes.description} size="lg" ta="center">
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button size="md" variant="subtle">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
