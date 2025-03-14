// contracts/Auth.sol
pragma solidity ^0.7.0;

contract Auth {
    struct User {
        string email;
        string password;
        bool registered;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed userAddress);
    event UserLoggedIn(address indexed userAddress);

    function register(string memory _email, string memory _password) public {
        require(!users[msg.sender].registered, "User already registered.");
        users[msg.sender] = User(_email, _password, true);
        emit UserRegistered(msg.sender);
    }

    function login(string memory _email, string memory _password) public view returns (bool) {
        User memory user = users[msg.sender];
        require(user.registered, "User is not registered.");
        require(keccak256(abi.encodePacked(user.email)) == keccak256(abi.encodePacked(_email)), "Incorrect email.");
        require(keccak256(abi.encodePacked(user.password)) == keccak256(abi.encodePacked(_password)), "Incorrect password.");
        return true;
    }

    function isRegistered() public view returns (bool) {
        return users[msg.sender].registered;
    }
}
