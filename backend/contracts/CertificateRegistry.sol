// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string rollNumber;
        string course;
        string institution;
        uint256 yearOfPassing;
        bytes32 documentHash;
        uint256 timestamp;
        bool isActive;
    }
    
    mapping(bytes32 => Certificate) public certificates;
    bytes32[] public certificateHashes;
    address public admin;
    
    event CertificateStored(bytes32 indexed hash, string studentName, string rollNumber);
    event CertificateVerified(bytes32 indexed hash, bool isValid);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function storeCertificate(
        bytes32 _hash,
        string memory _studentName,
        string memory _rollNumber,
        string memory _course,
        string memory _institution,
        uint256 _yearOfPassing
    ) external onlyAdmin {
        require(certificates[_hash].timestamp == 0, "Certificate already exists");
        
        certificates[_hash] = Certificate({
            studentName: _studentName,
            rollNumber: _rollNumber,
            course: _course,
            institution: _institution,
            yearOfPassing: _yearOfPassing,
            documentHash: _hash,
            timestamp: block.timestamp,
            isActive: true
        });
        
        certificateHashes.push(_hash);
        emit CertificateStored(_hash, _studentName, _rollNumber);
    }
    
    function verifyCertificate(bytes32 _hash) external view returns (bool) {
        return certificates[_hash].isActive;
    }
    
    function getCertificate(bytes32 _hash) external view returns (
        string memory studentName,
        string memory rollNumber,
        string memory course,
        string memory institution,
        uint256 yearOfPassing,
        bytes32 documentHash,
        uint256 timestamp,
        bool isActive
    ) {
        Certificate memory cert = certificates[_hash];
        return (
            cert.studentName,
            cert.rollNumber,
            cert.course,
            cert.institution,
            cert.yearOfPassing,
            cert.documentHash,
            cert.timestamp,
            cert.isActive
        );
    }
    
    function deactivateCertificate(bytes32 _hash) external onlyAdmin {
        require(certificates[_hash].timestamp > 0, "Certificate does not exist");
        certificates[_hash].isActive = false;
    }
    
    function getTotalCertificates() external view returns (uint256) {
        return certificateHashes.length;
    }
}
