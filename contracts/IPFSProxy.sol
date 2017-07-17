pragma solidity ^0.4.11;

import 'Ownable.sol';

contract IPFSProxy is Ownable {
	mapping(address=>bool) public membership;
	mapping(address => mapping( address => bool)) public complained;
        mapping(address => uint) public complaint;
	uint banThreshold;
	
	/**
	* @dev Throws if called by any account other than a valid member. 
	*/
	modifier onlyValidMembers {
		if (membership[msg.sender] != true) {
		  throw;
		}
		_;
	}

	event HashAdded(address PubKey, string IPFSHash, uint ttl);
	event HashRemoved(address PubKey, string IPFSHash);
	event Banned(string IPFSHash);
	event BanAttempt(address complainer, address _Member, uint complaints );

	/**
	* @dev Constructor - adds the owner to the list of valid members
	*/
	function IPFSProxy(){
		addMember(msg.sender);
		banThreshold = 1;
	}

	/**
	* @dev Add hash to persistent storage
	* @param _IPFSHash The ipfs hash to propagate.
	* @param _ttl amount of time is seconds to persist this. 
	*/
	function addHash(string _IPFSHash, uint _ttl) onlyValidMembers{
		HashAdded(msg.sender,_IPFSHash,_ttl);
	}

	/**
	* @dev Remove hash from persistent storage
	* @param _IPFSHash The ipfs hash to propagate.	
	*/
	function removeHash(string _IPFSHash) onlyValidMembers{
		HashRemoved(msg.sender,_IPFSHash);
	}

	/**
	*@dev removes a member who exceeds the cap
	*/
	function banMember (address _Member, string _evidence) onlyValidMembers {
		if (!membership[_Member]) {throw;}
                if (complained[msg.sender][_Member]) {throw;}
		complained[msg.sender][_Member] = true;
		complaint[_Member] += 1;	
		if (complaint[_Member] >= banThreshold) { 
			membership[_Member] = false;
			MemberRemoved(_Member);
                        Banned(_evidence);
		} else {
			BanAttempt(msg.sender, _Member, complaint[_Member]);
		}
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
	* @dev update ban threshold
	*/
        function updateBanThreshold (uint _banThreshold) onlyOwner {
		banThreshold = _banThreshold;
	}

	/**
	* @dev check if an address is member of the consortium 
	* @param _Address address of the pubkey to test.	
	*/
	function isMember(address _Address) returns (bool _isMember) {
		return (membership[_Address] == true);
	}
}
