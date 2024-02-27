import { Button, Container, Group, Text, Title } from "@mantine/core";

import classes from "./error.module.css";

const error = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
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
};

export default error;
