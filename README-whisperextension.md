
# Supporting IPFS functions over whisper

on whisper channel topic '0x<address of consortium contract>'

## Adding an IFPS hash

```

{	
	version: 1.0.0
	payload: {
		command: 'addHash'
		ipfshash: <IPFSHASH>
		ttl: <uint>	
	},
	signer: <pubkey>
	signature: {
		 v: ...
		 r: ...
		 s: ...
	}
}

```

```

// where v,r,s is the stringified payload , ECDSA signed with the pubkey in the 'signer' field
// the script interpreting this message should verify the signature, and verify that the
// signer is member of the consortium

```

## Removing an IFPS hash:

```

{
	version: 1.0.0
	payload: {
		command: 'removeHash'
		ipfshash: <IPFSHASH>
	}
	signer: <pubkey>
	signature: {
		 v: ...
		 r: ...
		 s: ...
	}
}

```

