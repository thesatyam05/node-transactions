# Node-Transactions

wallet and transaction making system.

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB (mongoose npm package)

**Authentication:** JWT

**Logging:** Winston

**Credentials encryption:** bcryptjs

## Routes

### for user + admin

-  Signup

```http
  POST /api/auth/signup
```

| Parameter       | Type     | Description                         |
| :-------------- | :------- | :---------------------------------- |
| `accountNumber` | `number` | **Required**. unique account number |
| `name`          | `string` | **Required**. name                  |
| `email`         | `string` | **Required**. email                 |
| `password`      | `string` | **Required**. password              |
| `pin`           | `number` | **Required**. 6 digit pin           |

for admin account
| `role` | `string` | `admin` default: `user` |

signup for user
![image](https://user-images.githubusercontent.com/85938434/230086362-41d6c032-1c4d-43a3-a398-0af748ed493d.png)
signup for admin
![image](https://user-images.githubusercontent.com/85938434/230085441-60a7508f-5714-46c4-b4ff-d4f82561b2e9.png)

-  Signin

```http
  POST /api/auth/signin
```

| Parameter       | Type     | Description                         |
| :-------------- | :------- | :---------------------------------- |
| `accountNumber` | `number` | **Required**. unique account number |
| `password`      | `string` | **Required**. password              |
| `pin`           | `number` | **Required**. 6 digit pin           |

for user + admin
![image](https://user-images.githubusercontent.com/85938434/230085701-54c32351-d38b-4993-b6ab-0754362392d7.png)

-  Send money

```http
  POST /api/banking/sendmoney?reciever=${R}&amount=${A}
```

`R: reciever account number, A: amount to be sent`

-  Passbook ( fetch all transactions for logged in user )

```http
  GET /api/banking/passbook
```

### for only admins

-  All Users ( fetch all users )

```http
  GET /api/admin/userdata
```

-  All transactions ( fetch transactions of all user )

```http
  GET /api/admin/alltransactions
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODBURI` : MongoDB connection URI

`JWT` : JWT secret for tokens

## Setup

-  Clone this repository

```bash
git clone https://github.com/thesatyam05/node-transactions.git
```

-  go to server folder

```bash
cd server
```

-  install necessary packages and start server

```bash
npm install
npm run start
```
