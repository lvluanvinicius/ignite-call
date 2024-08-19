import { Heading, Text } from "@ignite-ui/react";
import { Container, Hero, Preview } from "./styles";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";

import PreviewImage from "../../assets/app-preview.png";
import Image from "next/image";

export default function handle() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size={"4xl"}>
          Agendamento descomplicado
        </Heading>
        <Text size={"xl"}>
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>
        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={PreviewImage}
          alt="Calendário simbolizando aplicação em funcionamento."
          width={800}
          height={400}
          priority
        />
      </Preview>
    </Container>
  );
}
