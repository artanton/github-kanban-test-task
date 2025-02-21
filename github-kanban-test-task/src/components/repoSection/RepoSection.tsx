import { selectPepoRate, selectRepoName } from "@/redux/selectors";
import { Box, HStack, Icon, Link, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HiStar } from "react-icons/hi";

export const RepoSection = () => {
  const rate = useSelector(selectPepoRate);
  const issuesUrl = useSelector(selectRepoName);
  const udaptNumber = Math.round(rate / 1000);

  const repoUrl = issuesUrl.split("/").slice(0, 4).join("/");

  const owner = issuesUrl.split("/")[3];
  const repo = issuesUrl.split("/")[4];

  return (
    <Box paddingLeft="20" spaceX="2">
      <HStack gap="1" fontSize="large" fontWeight="medium">
        <Link
          href={`${repoUrl}`}
          color="blue.500"
          fontWeight="bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          {owner}
        </Link>
        <Text fontWeight="bold">{">"}</Text>
        <Link
          href={`${issuesUrl}`}
          color="blue.500"
          fontWeight="bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          {repo}
        </Link>

        <Icon color="orange.400">
          <HiStar />
        </Icon>

        <Text fontSize="large" fontWeight="bold">
          {udaptNumber} K stars{" "}
        </Text>
      </HStack>
    </Box>
  );
};
