# Web3.0 Project - React & Solidity

## Framework & Library

- Front-end

  - React
  - Tailwindcss
  - ethers (version 5)
  - vite

- Smart Contract

  - hardhat
  - chai
  - ethers (version 5)
  - ethereum-waffle(version 4)

- Wallet

  - Metamask

## Directory

- Front-end

```
client/
├── images
├── public/
├── src/
│   ├── assets/
|   |── components/
|   |── context/
|   |── utils/
|   |── App.jsx
├── package.json/
├── tailwind.config.js/
├── vite.config.js/
```

- Smart Contract

```
smart_contract/
├── artifacts/
├── cache/
├── contract/
│   ├── Transactions.sol/
├── scripts/
│   ├── deploy.js/
├── package.json/
```

## Development

### 1. Main service page

![서비스이미지](/images/mainpage.PNG)

### 2. Transaction

#### 2.1 Before Transaction - from Account 1

![beforeTransaction-account1](/images/1.png)

#### 2.2 Seding money - from Account 1 -> to Account 2

<table>
  <tr>
    <td><img src="/images/2.png" alt="image2"></td>
    <td><img src="/images/3.png" alt="image2"></td>
    <td><img src="/images/4.png" alt="image2"></td>
  </tr>
</table>

#### 2.3 After seding money - hash value, account 1, account 2

![beforeTransaction-account1](/images/5.png)

<table>
  <tr>
    <td><img src="/images/7.png" alt="image2"></td>
    <td><img src="/images/6.png" alt="image2"></td>
  </tr>
</table>

#### 2.4 Result check

<table>
  <tr>
    <td><img src="/images/8.png" alt="image2"></td>
    <td><img src="/images/9.png" alt="image2"></td>
  </tr>
</table>
