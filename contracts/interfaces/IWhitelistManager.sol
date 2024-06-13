// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface IWhitelistManager {
    
    function isCXO(address _address) external view returns (bool);
    
    function isSeniorManager(address _address) external view returns (bool);
    
    function isWhitelistUser(address _address) external view returns (bool);
    
    function addUserWhitelisted(address _address) external;
    
    function removeUserWhitelisted(address _address) external;
    
    function addSeniorManagerRole(address _address) external;
    
    function removeSeniorManagerRole(address _address) external;
    
    function addCXORole(address _address) external;
    
    function removeCXORole(address _address) external;
}
