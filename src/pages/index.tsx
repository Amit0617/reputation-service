import {
    Button,
    Container,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    VStack
} from "@chakra-ui/react"
import { getReputationCriteria, OAuthProvider, ReputationCriteria } from "@interep/reputation"
import { getHarmonyReputationAllLevelCriteria, Harmony, HarmonyReputationAllLevelCriteria } from "src/core/harmony"
import { Step, Steps } from "chakra-ui-steps"
import { GetServerSideProps } from "next"
import { signIn as _signIn } from "next-auth/client"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { IconType } from "react-icons"
import { FaGithub, FaRedditAlien, FaTwitter, FaDiscourse } from "react-icons/fa"
import { GoSearch } from "react-icons/go"
import { GroupBox, GroupBoxButton, GroupBoxHeader, GroupBoxOAuthContent } from "src/components/group-box"
import EthereumWalletContext from "src/context/EthereumWalletContext"
import useGroups from "src/hooks/useGroups"
import { Group } from "src/types/groups"
import { capitalize } from "src/utils/common"
import { groupBy, mapReputationRule } from "src/utils/frontend"
import { hostname } from "os"
// import { decryptMessage } from "src/core/webCrpyto"
// import { decreptedKey, publicKey } from "src/core/crypto"
// import {  } from "src/core/harmony/harmonyReputationLevelAndCriteria"

const oAuthIcons: Record<string, IconType> = {
    twitter: FaTwitter,
    github: FaGithub,
    reddit: FaRedditAlien,
    Harmony: FaDiscourse
}

export default function OAuthProvidersPage(): JSX.Element {
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
    const { _account } = useContext(EthereumWalletContext)
    const [_reputationCriteria, setReputationCriteria] = useState<ReputationCriteria | HarmonyReputationAllLevelCriteria>()
    const [_oAuthProviders, setOAuthProviders] = useState<[string, Group[]][]>()
    // const [_harmonyProvider, setHarmonyProvider] = useState<[string, Group[]][]>()
    const [_searchValue, setSearchValue] = useState<string>("")
    const [_sortingValue, setSortingValue] = useState<string>("2")
    const { getGroups } = useGroups()
    const [isClicked, setIsClicked] = useState<Boolean>(false)
    const [encodedKey, setEncodedKey] = useState<BufferSource>()
    const [privateKey, setPrivateKey] = useState<CryptoKey>()
    const [publicKey, setPublicKey] = useState<CryptoKey>()

    useEffect(() => {
        ; (async () => {
            const groups = await getGroups()

            if (groups) {
                setOAuthProviders(groupBy(groups, "provider", Object.values(OAuthProvider && Harmony)))
                // setHarmonyProvider(groupBy(groups, "provider", Object.values(Harmony)))
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getTotalGroupSizes(provider: any): number {
        const groups: Group[] = provider[1]

        return groups.reduce((t, c) => t + c.size, 0)
    }

    const sortCb = useCallback(
        (oAuthProviderA: any, oAuthProviderB: any) => {
            switch (_sortingValue) {
                case "2":
                    return oAuthProviderA[0].localeCompare(oAuthProviderB[0])
                case "3":
                    return oAuthProviderB[0].localeCompare(oAuthProviderA[0])
                case "1":
                default:
                    return getTotalGroupSizes(oAuthProviderB) - getTotalGroupSizes(oAuthProviderA)
            }
        },
        [_sortingValue]
    )

    const filterCb = useCallback(
        (oAuthProvider: any) => {
            const name = oAuthProvider[0]

            return !_searchValue || name.includes(_searchValue.toLowerCase())
        },
        [_searchValue]
    )

    function openModal(oAuthProvider: OAuthProvider) {
        const reputationCriteria = Harmony ? getHarmonyReputationAllLevelCriteria() : getReputationCriteria(oAuthProvider)

        setReputationCriteria(reputationCriteria)

        onModalOpen()
    }


    function _signInHarmony() {
        setIsClicked(!isClicked)
        // window.open("https://talk.harmony.one/login", "_blank")



        // function getMessageEncoding() {
        //     let message = "message" // some random text maybe
        //     let enc = new TextEncoder();
        //     return enc.encode(message);
        // }

        /*
        Fetch the ciphertext and decrypt it.
        Write the decrypted message into the "Decrypted" box.
        */
        async function decryptMessage(key: CryptoKey) {
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP"
                },
                key,
                encodedKey
            );

            const dec = new TextDecoder();
            console.log("dec.decode", dec.decode(decrypted))
            return dec.decode(decrypted);
        }


        /*
        Generate an encryption key pair
        */

        window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                // Consider using a 4096-bit key for systems that require long-term security
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        ).then((keyPair) => {
            console.log("Keypairs", keyPair.publicKey, keyPair.privateKey);

            // export privateKey
            setPrivateKey(keyPair.privateKey)
            setPublicKey(keyPair.publicKey)
            return keyPair.privateKey && keyPair.publicKey
            // encryptMessage(keyPair.publicKey);
            decryptMessage(keyPair.privateKey);
        });


        const url = new URL(`https://talk.harmony.one/user-api-key/new?application_name=interep-harmony`)

        // url.searchParams.append('auth_redirect', 'http://localhost:3000/') // needs to ask permission from website admin
        // url.searchParams.append('application_name', applicationName)
        url.searchParams.append('client_id', hostname())
        url.searchParams.append('scopes', 'write')
        url.searchParams.append('public_key', publicKey.toString())
        url.searchParams.append('nonce', '1')

        window.open(url, "_blank")

    }

    async function checkValidity(encodedKey: BufferSource) {


        // await fetch(`https://talk.harmony.one/u/${username}.json`)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data)
        //         if (data.user.can_edit) {
        //             alert("username verified")
        //         }
        //     })
        // return summary.user.can_edit

        // const trim = encodedKey.toString().trim().replace(/\s/g, '') // remove spaces
        // setEncodedKey(trim.toBufferSource())
        const json = decryptMessage(privateKey).toString()
        const API = JSON.parse(json).key

        console.log(`The API key is ${API}`)

    }

    const handleInput = (event) => {
        setEncodedKey(event.target.value);
    };

    return (
        <Container flex="1" mb="80px" mt="160px" px="80px" maxW="container.xl">
            <Stack direction={["column", "column", "row"]} spacing="10">
                <VStack flex="1" align="left">
                    <Heading as="h3" size="lg" mb="2">
                        Anonymously use your social reputation on-chain
                    </Heading>

                    <Text color="background.400" fontSize="md">
                        To join Social network groups you will need to authorize each provider individually to share
                        your credentials with Interep.
                    </Text>
                </VStack>
                <HStack flex="1" justify="center">
                    <Image src="./oauth-illustration.svg" alt="Social network illustration" h="150px" />
                </HStack>
            </Stack>

            {/* Steps to join social network groups */}

            <Steps activeStep={0} colorScheme="background" size="sm" my="12">
                <Step label="Authorize provider" />
                <Step label="Generate Semaphore ID" />
                <Step label="Join social network group" />
            </Steps>

            {/* Search authorising social media networks */}
            <HStack justify="space-between" mt="80px" mb="10">
                <InputGroup maxWidth="250px">
                    <InputLeftElement pointerEvents="none">
                        <GoSearch color="gray" />
                    </InputLeftElement>
                    <Input
                        colorScheme="primary"
                        focusBorderColor="primary.500"
                        placeholder="Search"
                        value={_searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </InputGroup>

                {/* Sort social networks in alphabetical or inverted order or with most members first */}
                <Select
                    value={_sortingValue}
                    onChange={(event) => setSortingValue(event.target.value)}
                    maxWidth="250px"
                    focusBorderColor="primary.500"
                >
                    <option value="1">Most members</option>
                    <option value="2">A-Z</option>
                    <option value="3">Z-A</option>
                </Select>
            </HStack>

            {_oAuthProviders ? (
                <SimpleGrid minChildWidth="325px" spacing={5}>
                    {_oAuthProviders
                        .sort(sortCb)
                        .filter(filterCb)
                        .map((p, i) => (
                            <GroupBox key={i.toString()}>
                                <GroupBoxHeader title={capitalize(p[0])} icon={oAuthIcons[p[0]]} />
                                <GroupBoxOAuthContent
                                    onInfoClick={() => openModal(p[0] as OAuthProvider)}
                                    icon={oAuthIcons[p[0]]}
                                    groups={p[1]}
                                />
                                {isClicked ?
                                    (
                                        <Stack>
                                            <Input isInvalid onChange={handleInput} placeholder="Paste the key you got after logging in" size="md" />
                                            <Button onClick={() => checkValidity(encodedKey)} />
                                        </Stack>
                                    ) : (
                                        <GroupBoxButton
                                            alertTitle="Confirm authorization"
                                            alertMessage={`Interep wants to connect with the last ${capitalize(
                                                p[0]
                                            )} account you logged into. Approving this message will open a new window.`}
                                            // {isClicked? onClick={()=> openInputBox()} : }
                                            onClick={() => Harmony ? _signInHarmony() : _signIn(p[0])}
                                            disabled={!_account}
                                        >
                                            Authorize
                                        </GroupBoxButton>)}
                            </GroupBox>
                        ))}
                </SimpleGrid>
            ) : (
                <SimpleGrid columns={{ sm: 2, md: 3 }} spacing={5}>
                    {Object.values(oAuthIcons).map((_p, i) => (
                        <Skeleton
                            key={i.toString()}
                            startColor="background.800"
                            endColor="background.700"
                            borderRadius="4px"
                            height="318px"
                        />
                    ))}
                </SimpleGrid>
            )}

            {_reputationCriteria && (
                <Modal isOpen={isModalOpen} onClose={onModalClose} size="3xl" isCentered>
                    <ModalOverlay bg="blackAlpha.700" />

                    <ModalContent>
                        <ModalHeader>{capitalize(_reputationCriteria.provider)} group qualifications</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb="6">
                            <Table variant="grid" colorScheme="background">
                                <Thead>
                                    <Tr>
                                        <Th>Group</Th>
                                        {_reputationCriteria.parameters.map((parameter, i) => (
                                            <Th key={i.toString()}>{parameter.name.replace(/([A-Z])/g, " $1")}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {_reputationCriteria.reputationLevels.map((reputation, i) => (
                                        <Tr key={i.toString()}>
                                            <Td>
                                                <HStack spacing="4">
                                                    <Icon
                                                        as={oAuthIcons[_reputationCriteria.provider]}
                                                        color={`${reputation.name}.400`}
                                                    />
                                                    <Text>{capitalize(reputation.name)}</Text>
                                                </HStack>
                                            </Td>
                                            {reputation.rules.map((rule, i) => (
                                                <Td key={i.toString()}>{mapReputationRule(rule)}</Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const authorized = !!req.cookies["__Secure-next-auth.session-token"] || !!req.cookies["next-auth.session-token"]

    if (!authorized) {
        return {
            props: {}
        }
    }

    return {
        redirect: {
            destination: "/oauth",
            permanent: false
        }
    }
}
