// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserAuth {

    enum Role { Patient, Doctor, Admin }

    struct User {
        string name;
        string email;
        bytes32 password; // Storing the password hash
        address wallet;
        Role role;
    }

    mapping(address => User) public users;
    mapping(string => bool) private emailRegistered;
    address[] private userAddresses; // Array to keep track of registered addresses

    // Modifier to check if the user already exists
    modifier userNotExists(address _wallet) {
        require(users[_wallet].wallet == address(0), "User already exists.");
        _;
    }

    // Modifier to check if the email is already registered
    modifier emailNotRegistered(string memory _email) {
        require(!emailRegistered[_email], "Email already registered.");
        _;
    }

    // Register function for new users
    function register(
        string memory _name,
        string memory _email,
        string memory _password,
        Role _role
    ) public userNotExists(msg.sender) emailNotRegistered(_email) {
        // Hash the password
        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));

        // Create new user
        users[msg.sender] = User(_name, _email, hashedPassword, msg.sender, _role);
        emailRegistered[_email] = true;
        userAddresses.push(msg.sender); // Add the new user's address to the array
    }

    // Authenticate user by checking email and password
    function login(string memory _email, string memory _password) public view returns (bool) {
        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));

        for (uint256 i = 0; i < userAddresses.length; i++) {
            address userAddr = userAddresses[i];
            if (
                keccak256(abi.encodePacked(users[userAddr].email)) == keccak256(abi.encodePacked(_email)) &&
                users[userAddr].password == hashedPassword
            ) {
                return true;
            }
        }

        return false;
    }

    // Get user role
    function getUserRole(address _user) public view returns (Role) {
        return users[_user].role;
    }
}
