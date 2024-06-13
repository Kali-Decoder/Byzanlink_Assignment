// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.16;

import {Roles} from "./Roles.sol";

contract WhitelistManager {
    using Roles for Roles.Role;

    Roles.Role private _cxos;
    Roles.Role private _users;
    Roles.Role private _senior_managers;


    constructor() {
        _cxos.add(msg.sender);
        _senior_managers.add(msg.sender);
        _users.add(msg.sender);
    }

 
    /**
     * @dev Modifier for only CXOS calling
     */
    modifier onlyCxos() {
        require(_cxos.has(msg.sender), "DOES_NOT_HAVE_CXOS_ROLE");
        _;
    }



    /**
     * @dev To check whether the address is CXOS or not
     */
    function isCXO(address _address) external view returns (bool) {
        return _cxos.has(_address);
    }

    /**
     * @dev To check whether the address is SENIOR MANAGER or not
     */
    function isSeniorManager(address _address) external view returns (bool) {
        return _senior_managers.has(_address);
    }

  
    /**
     * @dev To check whether the address is WHITELISTED or not
     */
    function isWhitelistUser(address _address) external view returns (bool) {
        return _users.has(_address);
    }

  

    /**
     * @dev To add an address to whitelisted role
     */
    function addUserWhitelisted(address _address) public onlyCxos {
        _users.add(_address);
    }


    /**
     * @dev To remove an address to whitelisted role
     */
    function removeUserWhitelisted(address _address) public onlyCxos {
        _users.remove(_address);
    }

    /**
     * @dev To remove an address to senior manager role
     */
    function addSeniorManagerRole(address _address) public onlyCxos {
        _senior_managers.add(_address);
    }



    /**
     * @dev To remove an address to senior manager  role
     */
    function removeSeniorManagerRole(address _address) public onlyCxos {
        _senior_managers.remove(_address);
    }


     /**
     * @dev To remove an address to CXO role
     */
    function addCXORole(address _address) public onlyCxos {
        _cxos.add(_address);
    }



    /**
     * @dev To remove an address to CXO role
     */
    function removeCXORole(address _address) public onlyCxos {
        _cxos.remove(_address);
    }


  
}
