pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract IPFSProxy is Ownable {
	mapping(address=>bool) public membership;

	/**
	* @dev Throws if called by any account other than a valid member. 
	*/
	modifier onlyValidMembers() {
		if (membership[msg.sender] != true) {
		  throw;
		}
		_;
	}

	event HashAdded(address PubKey, string IPFSHash, uint ttl);
	event HashRemoved(address PubKey, string IPFSHash);


	/**
	* @dev Constructor - adds the owner to the list of valid members
	*/
	function IPFSProxy(){
		addMember(msg.sender);
	}

	/**
	* @dev Add hash to persistent storage
	* @param _IPFHash The ipfs hash to propagate.
    * @param _ttl amount of time is seconds to persist this. 
	*/
	function addHash(string _IPFHash, uint _ttl) onlyValidMembers{
		HashAdded(msg.sender,_IPFHash,_ttl);
	}

	/**
	* @dev Remove hash from persistent storage
	* @param _IPFHash The ipfs hash to propagate.	
	*/
	function removeHash(string _IPFHash) onlyValidMembers{
		HashRemoved(msg.sender,_IPFHash);
	}


	event MemberAdded(address _Address);
	event MemberRemoved(address _Address);
	/**
	* @dev allows Address to add/remove hashes 
	* @param _Address address of the pubkey to whitelist.	
	*/
	function addMember(address _Address) onlyOwner {
		membership[_Address] = true;
		MemberAdded(_Address);
	}

	/**
	* @dev remove allowance from Address to add/remove hashes 
	*/
	function removeMember(address _Address) onlyOwner {
		membership[_Address] = false;
		MemberRemoved(_Address);
	}
	/**
	* @dev check if an address is member of the consortium 
	* @param _Address address of the pubkey to test.	
	*/
	function isMember(address _Address) returns (bool _isMember) {
		return (membership[_Address] == true);
	}
}
