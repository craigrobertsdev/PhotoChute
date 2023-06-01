# PhotoChute

## Photo Sharing Made Easy!

PhotoChute is a web based application for users to share photos with friends and family simply and easily. The application lets users upload photos from an event or gathering that their friends might want to see or have copies of and makes it easy for them to download those files to keep. Creating a one stop shop for sharing and uploading files between all people and platforms.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Table of Contents

* [Description](#description)
* [Acceptance Criteria](#acceptance-criteria)
* [Screenshot](#screenshot)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributors](#contributors)
* [Questions](#questions)

## Acceptance Criteria

```
GIVEN someone who goes out with my friends
WHEN I take photos, I want to be able to share those photos with my friends
WHEN I create an account
THEN I am able to create a group to upload photos to
WHEN I create the group
THEN I can invite other members to join and upload photos to the group 
WHEN I upload photos
THEN they are stored for a period of time
WHEN I want to delete a photo
THEN I have an option to delete that photo
WHEN I want to remove a person from a group I have created
THEN I am able to remove that person
WHEN I log into the app
THEN I am presented with a list of groups that I am a member of, a list of groups that I am the owner of, the option to view the photos i’ve uploaded, the option to create a group and the option to view my account information
WHEN I look at an uploaded photo
THEN I am presented with information about the upload date, file size, the group it is attached to and who has permission to view the photo
WHEN I look at my account information
THEN I am presented with information about how much storage capacity I have remaining

```

## Work Description

For this Project we utilised Express.js, GraphQL, Stripe, Mongoose, React, MongoDB, BootStrap, Apollo Client and Azure to create a functional react website that separates front end and back end functionality.The photos are stored in Azure blob storage and thumbnails are created automatically via a serverless function that is triggered each time a photo is uploaded. The styling is predominantly done with React-Bootstrap and JSX was created by uploading Figma to Quest AI.

For this project we separated the jobs into front end, back end and additional features, By doing this we alleviated the possibility of merge conflicts and repetition of code. Throughout the project we were able to avoid any major issues, Issues we did face were minor issues that were easily resolved with some trial and error. The biggest challenge we faced was lack of knowledge of the technologies we were using, a lot of time was spent learning and developing our skills with the used technologies to create what we envisaged for the project.

Our major success was our communication and planning we started this project with a good idea in mind of what the final product will look and function like which helped all of us achieve our goal faster and without issues. 
.

## Made With

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Google](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)

## Screenshots

![PhotoChute Home Page](./client/src/assets/images/Screenshot%201.png)
![PhotoChute User Page](./client/src/assets/images/Screenshot%202.png)
![PhotoChute Group Page](./client/src/assets/images/Screenshot%203.png)

## Installation

No dependencies are required to use this page.

## Usage

This project is deployed using Heroku [here](https://photochute.herokuapp.com/). Please note the app is currently been run in development mode so purchases of premium accounts will not be accepted.

You can create an account and add friends to your account and then create groups with friends where you can upload and share photos.

## License

The license used for this project is \
[MIT](https://opensource.org/licenses/MIT)

## Contributors

This Project was made by The Walruses:

* [Craig Roberts](https://github.com/craigrobertsdev/)
* [Shae Thompson](https://github.com/shae-thompson)
* [Lucien Haines](https://github.com/Lucienpep)

Each member brought their unique skills and expertise to the table, and together we were able to create a great, functional project.

## Questions

If you have any questions or feedback, please feel free to open an issue or reach out to us directly. We're always here to help!

[![Outlook](https://img.shields.io/badge/Microsoft_Outlook-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white)](mailto:craig.roberts11@outlook.com)
[![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/craigrobertsdev/)

&copy; 2023 PhotoChute. All rights reserved.
