## Web App

Start the Web app by cloning from git:
   
   ```bash
   git clone https://github.com/DavidIzhaki/PhotoTube-Web.git
   cd PhotoTube-Web
   ```

Build the frontend:

```bash
npm run build
```

Then, copy the files in build folder into the public folder in the Node.js server.

### Start the web app:

After copying the build, start the Node.js server and TCP server with the help
of the explanations in **wiki/envSetup.md**.

### Features:

1. **Watch Videos**

    Browse and watch videos from the main video list.

   ![image](https://github.com/user-attachments/assets/bd4fa455-a0c9-4861-bd75-e551bb867042)

2. **Search videos:**

    Search videos in the home page:
   
    ![image](https://github.com/user-attachments/assets/8e7bddc6-1f31-4d3b-a330-57ec1f13d5d0)

3. **Dark mode:**

     ![image](https://github.com/user-attachments/assets/98f923e9-dc41-4c05-a42d-865069a49156)

   
5. **User Authentication**

    **Login:** Log in using valid credentials.

   ![image](https://github.com/user-attachments/assets/4aa0fae4-08a4-49fb-a95b-96676b919171)


    **Logout:** Log out of the account from the navigation menu.

    **Register:** Create a new account by filling out the registration form.

   ![image](https://github.com/user-attachments/assets/d9cc50a5-c59b-4b9b-8737-70073c03abf3)


6. **Video Management**

    **Logged in users can handle their videos:**

   
    **Create Video:** Upload a new video, specifying a title, description, and video file.

   ![image](https://github.com/user-attachments/assets/df18189b-03d8-4f36-a6e8-29c94a5fd302)

    **Update Video:** Edit the title and description of uploaded videos.

   ![image](https://github.com/user-attachments/assets/23b06ba5-8688-4909-b229-b8f418ed6aa8)

    **Delete Video:** Remove videos that were uploaded by the user.

   ![image](https://github.com/user-attachments/assets/d9fa6afe-8791-463b-a4ee-bf4c8605c74f)


7. **Comment Management**
   
    **Logged in users can comment:**
 
    **Create Comment:** Add comments on a video.

    **Update Comment:** Edit the user's comments.

    **Delete Comment:** Delete user comments.

   ![image](https://github.com/user-attachments/assets/7effe969-49a4-461e-9427-3fab1c0f1aa0)


9. **Likes/Dislikes**

    **Like/Dislike:** Like or dislike a video. Users can see the like/dislike count.

10. **User Management**

    Users can create, update, or delete users from the platform.

    ![image](https://github.com/user-attachments/assets/977a6389-f0a5-4f85-86fa-51907d70aa32)

    Go the the user's videos page by clicking on the user's picture:

    ![image](https://github.com/user-attachments/assets/90766726-e64a-4a17-885d-c248b26c9d52)

