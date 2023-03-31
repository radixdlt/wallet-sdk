import {
  Bucket,
  Address,
  Decimal,
  Proof,
  AddressString,
  NonFungibleLocalIdString,
} from './manifest-value'

export class Manifest {
  instructions: string[]

  constructor(instructions: string[]) {
    this.instructions = instructions
  }

  public toString(): string {
    return this.instructions.join('\n')
  }
}

export class ManifestBuilder {
  private readonly instructions: string[]
  private readonly buckets: Map<string, number>
  private readonly proofs: Map<string, number>
  private id_allocator: number

  constructor() {
    this.instructions = []
    this.buckets = new Map<string, number>()
    this.proofs = new Map<string, number>()
    this.id_allocator = 512
  }

  /**
   * Take all the given resource from worktop.
   *
   * @param resourceAddress The resource address
   * @param bucketName The name of the new bucket
   * @returns
   */
  takeFromWorktop(
    resourceAddress: AddressString,
    bucketName: string
  ): ManifestBuilder {
    this.instructions.push(
      `TAKE_FROM_WORKTOP ${Address(resourceAddress)} ${Bucket(bucketName)};`
    )
    this.buckets.set(bucketName, this.id_allocator++)
    return this
  }

  /**
   * Take some amount of resource from worktop.
   *
   * @param amount The amount
   * @param resourceAddresses The resource address
   * @param bucketName The name of the new bucket
   * @returns
   */
  takeFromWorktopByAmount(
    amount: number,
    resourceAddresses: AddressString,
    bucketName: string
  ): ManifestBuilder {
    this.instructions.push(
      `TAKE_FROM_WORKTOP_BY_AMOUNT ${Decimal(amount)} ${Address(
        resourceAddresses
      )} ${Bucket(bucketName)};`
    )
    this.buckets.set(bucketName, this.id_allocator++)
    return this
  }

  /**
   * Take some non-fungibles from worktop.
   *
   * @param nonFungibleLocalIds The non-fungible IDs
   * @param resourceAddress The resource address
   * @param bucketName The name of the new bucket
   * @returns
   */
  takeFromWorktopByIds(
    nonFungibleLocalIds: NonFungibleLocalIdString[],
    resourceAddress: AddressString,
    bucketName: string
  ): ManifestBuilder {
    let temp = nonFungibleLocalIds
      .map(function (id) {
        return 'NonFungibleLocalId("' + id + '")'
      })
      .join(', ')
    this.instructions.push(
      `TAKE_FROM_WORKTOP_BY_IDS Array<NonFungibleLocalId>(${temp}) ${Address(
        resourceAddress
      )} ${Bucket(bucketName)};`
    )
    this.buckets.set(bucketName, this.id_allocator++)
    return this
  }

  /**
   * Returns a bucket to worktop.
   *
   * @param bucketName The bucket name
   * @returns
   */
  returnToWorktop(bucketName: string) {
    this.instructions.push(`RETURN_TO_WORKTOP ${Bucket(bucketName)};`)
    return this
  }

  /**
   * Asserts worktop contains resource.
   *
   * @param resourceAddress The resource address
   * @returns
   */
  assertWorktopContains(resourceAddress: AddressString): ManifestBuilder {
    this.instructions.push(
      `ASSERT_WORKTOP_CONTAINS ${Address(resourceAddress)};`
    )
    return this
  }

  /**
   * Asserts worktop contains some amount of resource.
   *
   * @param amount The amount
   * @param resourceAddress The resource address
   * @returns
   */
  assertWorktopContainsByAmount(
    amount: number,
    resourceAddress: AddressString
  ): ManifestBuilder {
    this.instructions.push(
      `ASSERT_WORKTOP_CONTAINS_BY_AMOUNT ${Decimal(amount)} ${Address(
        resourceAddress
      )};`
    )
    return this
  }

  /**
   * Asserts worktop contains some non-fungibles.
   *
   * @param nonFungibleLocalIds The non-fungible IDs
   * @param resourceAddress The resource address
   * @returns
   */
  assertWorktopContainsByIds(
    nonFungibleLocalIds: NonFungibleLocalIdString[],
    resourceAddress: AddressString
  ): ManifestBuilder {
    let temp = nonFungibleLocalIds
      .map(function (id) {
        return 'NonFungibleLocalId("' + id + '")'
      })
      .join(', ')
    this.instructions.push(
      `ASSERT_WORKTOP_CONTAINS_BY_IDS Array<NonFungibleLocalId>(${temp}) ${Address(
        resourceAddress
      )};`
    )
    return this
  }

  /**
   * Pops the most recent proof from the auth zone.
   *
   * @param proofName The name of the new proof
   * @returns
   */
  popFromAuthZone(proofName: string): ManifestBuilder {
    this.instructions.push(`POP_FROM_AUTH_ZONE ${Proof(proofName)};`)
    this.proofs.set(proofName, this.id_allocator++)
    return this
  }

  /**
   * Pushes a proof onto the auth zone.
   *
   * @param proofName The proof name
   * @returns
   */
  pushToAuthZone(proofName: string): ManifestBuilder {
    this.instructions.push(`PUSH_TO_AUTH_ZONE ${Proof(proofName)};`)
    return this
  }

  /**
   * Clears the auth zone.
   *
   * @returns
   */
  clearAuthZone(): ManifestBuilder {
    this.instructions.push('CLEAR_AUTH_ZONE;')
    return this
  }

  /**
   * Creates a composite proof from the auth zone with all the given resource.
   *
   * @param resourceAddress The resource address
   * @param proofName The name of the new proof
   * @returns
   */
  createProofFromAuthZone(
    resourceAddress: AddressString,
    proofName: string
  ): ManifestBuilder {
    this.instructions.push(
      `CREATE_PROOF_FROM_AUTH_ZONE ${Address(resourceAddress)} ${Proof(
        proofName
      )};`
    )
    this.proofs.set(proofName, this.id_allocator++)
    return this
  }

  /**
   * Creates a composite proof from the auth zone for the given amount.
   *
   * @param amount The amount
   * @param resourceAddress The resource address
   * @param proofName The name of the new proof
   * @returns
   */
  createProofFromAuthZoneByAmount(
    amount: number,
    resourceAddress: AddressString,
    proofName: string
  ): ManifestBuilder {
    this.instructions.push(
      `CREATE_PROOF_FROM_AUTH_ZONE_BY_AMOUNT ${Decimal(amount)} ${Address(
        resourceAddress
      )} ${Proof(proofName)};`
    )
    this.proofs.set(proofName, this.id_allocator++)
    return this
  }

  /**
   * Creates a composite proof from the auth zone for the give non-fungibles.
   *
   * @param nonFungibleLocalIds The non-fungible IDs
   * @param resourceAddress The resource address
   * @param proofName The name of the new proof
   * @returns
   */
  createProofFromAuthZoneByIds(
    nonFungibleLocalIds: NonFungibleLocalIdString[],
    resourceAddress: AddressString,
    proofName: string
  ): ManifestBuilder {
    let temp = nonFungibleLocalIds
      .map(function (id) {
        return 'NonFungibleLocalId("' + id + '")'
      })
      .join(', ')
    this.instructions.push(
      `CREATE_PROOF_FROM_AUTH_ZONE_BY_IDS Array<NonFungibleLocalId>(${temp}) ${Address(
        resourceAddress
      )} ${Proof(proofName)};`
    )
    this.proofs.set(proofName, this.id_allocator++)
    return this
  }

  /**
   * Creates a proof from a bucket
   *
   * @param bucketName The bucket name
   * @param proofName The name of the new proof
   * @returns
   */
  createProofFromBucket(
    bucketName: string,
    proofName: string
  ): ManifestBuilder {
    this.instructions.push(
      `CREATE_PROOF_FROM_BUCKET ${Bucket(bucketName)} ${Proof(proofName)};`
    )
    this.proofs.set(proofName, this.id_allocator++)
    return this
  }

  /**
   * Clones a proof.
   *
   * @param proofName The proof name
   * @param cloneName The clone proof name
   * @returns
   */
  cloneProof(proofName: string, cloneName: string): ManifestBuilder {
    this.instructions.push(
      `CLONE_PROOF ${Proof(proofName)} ${Proof(cloneName)};`
    )
    this.proofs.set(cloneName, this.id_allocator++)
    return this
  }

  /**
   * Drops a proof.
   *
   * @param proofName The proof name
   * @returns
   */
  dropProof(proofName: string): ManifestBuilder {
    this.instructions.push(`DROP_PROOF ${Proof(proofName)};`)
    return this
  }

  /**
   * Calls a function on a blueprint.
   *
   * @param packageAddress  The package address
   * @param blueprintName  The blueprint name
   * @param functionName  The function name
   * @param args The arguments, which must be in manifest format, e.g. `1u8`, `"string"`, `Bucket("name")`
   */
  callFunction(
    packageAddress: AddressString,
    blueprintName: string,
    functionName: string,
    args: string[]
  ): ManifestBuilder {
    this.instructions.push(
      `CALL_FUNCTION ${Address(
        packageAddress
      )} "${blueprintName}" "${functionName}" ${args.join(' ')};`
    )
    return this
  }

  /**
   * Calls a method on a component.
   *
   * @param componentAddress  The component address
   * @param methodName The method name
   * @param args The arguments, which must be in manifest format, e.g. `1u8`, `"string"`, `Bucket("name")`
   * @returns
   */
  callMethod(
    componentAddress: AddressString,
    methodName: string,
    args: string[]
  ): ManifestBuilder {
    this.instructions.push(
      `CALL_METHOD ${Address(componentAddress)} "${methodName}" ${args.join(
        ' '
      )};`
    )
    return this
  }

  /**
   * Mints additional fungible token
   *
   * @param resourceAddress The resource address of the fungible resource
   * @param amount The amount to mint
   * @returns
   */
  mintFungible(
    resourceAddress: AddressString,
    amount: number
  ): ManifestBuilder {
    this.instructions.push(
      `MINT_FUNGIBLE ${Address(resourceAddress)} ${Decimal(amount)};`
    )
    return this
  }

  /**
   * Withdraws resource from account.
   *
   * @param accountAddress The account component address
   * @param resourceAddress The resource address
   * @param amount The amount
   * @returns
   */
  withdrawFromAccount(
    accountAddress: AddressString,
    resourceAddress: AddressString,
    amount: number
  ): ManifestBuilder {
    this.instructions.push(
      `CALL_METHOD ${Address(accountAddress)} "withdraw" ${Address(
        resourceAddress
      )} ${Decimal(amount)};`
    )
    return this
  }

  /**
   * Withdraws some non-fungibles from account.
   *
   * @param accountAddress The account component address
   * @param nonFungibleLocalIds The non-fungible IDs
   * @param address The resource address
   * @returns
   */
  withdrawNonFungiblesFromAccount(
    accountAddress: AddressString,
    resourceAddress: AddressString,
    nonFungibleLocalIds: NonFungibleLocalIdString[]
  ): ManifestBuilder {
    let temp = nonFungibleLocalIds
      .map(function (id) {
        return 'NonFungibleLocalId("' + id + '")'
      })
      .join(', ')
    this.instructions.push(
      `CALL_METHOD ${Address(
        accountAddress
      )} "withdraw_non_fungibles" ${Address(
        resourceAddress
      )} Array<NonFungibleLocalId>(${temp});`
    )
    return this
  }

  /**
   * Creates proof of all the given resource from account.
   *
   * @param accountAddress The account component address
   * @param resourceAddress The resource address
   * @returns
   */
  createProofFromAccount(
    accountAddress: AddressString,
    resourceAddress: AddressString
  ): ManifestBuilder {
    this.instructions.push(
      `CALL_METHOD ${Address(accountAddress)} "create_proof" ${Address(
        resourceAddress
      )};`
    )
    return this
  }

  /**
   * Creates proof of some amount of resource from account.
   *
   * @param accountAddress The account component address
   * @param resourceAddress The resource address
   * @param amount The amount
   * @returns
   */
  createProofFromAccountByAmount(
    accountAddress: AddressString,
    resourceAddress: AddressString,
    amount: number
  ): ManifestBuilder {
    this.instructions.push(
      `CALL_METHOD ${Address(
        accountAddress
      )} "create_proof_by_amount" ${Address(resourceAddress)} ${Decimal(
        amount
      )};`
    )
    return this
  }

  /**
   * Creates proof of some non-fungibles from account.
   *
   * @param accountAddress The account component address
   * @param nonFungibleLocalIds The non-fungible IDs
   * @param resourceAddress The resource address
   * @returns
   */
  createProofFromAccountByIds(
    accountAddress: AddressString,
    resourceAddress: AddressString,
    nonFungibleLocalIds: NonFungibleLocalIdString[]
  ): ManifestBuilder {
    let temp = nonFungibleLocalIds
      .map(function (id) {
        return 'NonFungibleLocalId("' + id + '")'
      })
      .join(', ')
    this.instructions.push(
      `CALL_METHOD ${Address(accountAddress)} "create_proof_by_ids" ${Address(
        resourceAddress
      )} Array<NonFungibleLocalId>(${temp});`
    )
    return this
  }

  /**
   * Add any instruction.
   *
   * @param name The instruction name
   * @param args The instruction arguments
   * @returns
   */
  instruction(name: string, args: string[]): ManifestBuilder {
    this.instructions.push(`${name} ${args.join(' ')};`)
    return this
  }

  /**
   * Builds a transaction manifest.
   *
   * @returns a transaction manifest
   */
  build(): Manifest {
    return new Manifest(this.instructions)
  }
}
