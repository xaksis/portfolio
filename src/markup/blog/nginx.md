---
title: Setting up Nginx on AWS ec2
description: Set up for Nginx on a fresh ec2 instance
type: blog
img: /images/codebits.png
layout: ./src/markup/layout/blog.handlebars
createDate: 2017-03-08T13:29:35.000Z
---

# Quick setup for Nginx on a fresh ec2 Instance

So this is a quick one. I just went through setting up Nginx on ec2 for this very blog and was surprised how easy it was. so here's a quick how to

## 1. Lets install nginx
```bash
$ sudo yum install -y nginx
$ which nginx
/usr/sbin/nginx
```

## 2. start the service and verify you can hit it
```bash
$ sudo service nginx start
```
now hit the server with the browser and you should see nginx default page. by default nginx serves html from `/user/share/nginx/html`. We need to specify our own directory to serve from. So let's do that next.

## 3. lets create a directory to serve html from
we need to also modify permisson so that nginx can read from there
```bash
$ mkdir /var/www
$ sudo chmod -R 755 /var/wwww
```

## 4. Modify nginx config to point to the new directory
Nginx config file is located in `/etc/nginx/nginx.conf`. Open it with your favorite editor and modify the following section

before: 
```javascript
server {
  listen          80 default_server;
  listen          [::]:80 default_server;
  server_name     localhost;
  root            /user/share/nginx/html  
  ...
}
```
after:
```javascript
server {
  listen          80 default_server;
  listen          [::]:80 default_server;
  server_name     localhost;
  root            /var/www/myProject/dist; 
  ...
}
```

## 5. Restart nginx 
```bash
$ sudo service nginx restart
```

Try hitting the server again, you should now be able to serve your project content over nginx! Over to you.

