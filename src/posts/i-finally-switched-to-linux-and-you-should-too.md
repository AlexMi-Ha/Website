---
Id: 3
Title: I switched to Linux and why you should too
Summary: Here I share my reasons and experiences on switching my setup to run linux.
TitleImage: /images/posts/f1e39ffa-b36f-43ce-b098-5eda9ab293fd.webp
Date: 03.07.2024
Tags: Tech, Security
---

Sooo 👋,

a month ago I finally made the switch to a Linux based operating system 🐧.

I was a Windows user since I got my first computer and played with the thought of switching to Linux every now and then. But the last few years this voice became louder and louder and now, finally, I made the big change 🎈.

## The Microsoft disaster

For everyone active in the tech community this change does not come as a surprise. 

A few weeks ago, Microsoft announced their newest shenanigans - Microsoft Recall targeted for the new Copilot+ AI powered laptop. Recall is one of those products that sound really cool, but considering the current threat level in the tech community, this feature is an absolute no-go if distributed as closed source 😱.

For those not familiar with Microsoft Recall yet, it enables the user to __search through their activity on the computer using AI__. If you know you have visited a website with a picture of a goose in the past, you can search for goose and Recall finds the program and website used at the time 🪿. To achieve this, Recall periodically saves screenshots and metadata of the stuff you look at. This of course includes passwords, sensitive data like images or personal documents and all cat-picture websites you visit on your computer 🧡🖤.

Microsoft claims that Recall saves the captured data _locally only_ on the machine in an _encrypted_ format. __BUT__, as this data can be accessed through Recall itself, the information on how to decrypt this data must also be stored locally. This means, that if the encryption cannot be avoided in other ways, a hacker which has access to your machine can just use Recall to search through this history, making you __vulnerable__ to targeted __ads__, __social engineering__, __ransom__, __identity theft__, and much much more.

It is good, that the data is stored locally - _FOR NOW_. In my opinion, and I'm [not the only one with this concern](https://youtu.be/2-z-iwfPslI?si=j1Gj1CpZuXJry0wR&t=890), this will definitly not stay this way, in the future this _WILL_ be synced to the cloud or sent to a server for processing, due to the hardware requirements for such AI models.

This feature is especially dangerous for kids, elders and other non-tech savvy users, because they cannot or do not want to grasp the __major security implications__.

If any other company would release such an application, this would definitly be considered potential spyware 🕵.

Thankfully, after the massive backlash Microsoft got from the IT-Security community, they delayed this feature until current flaws are fixed. But as it is standing now, it still will be coming! In my opinion, the trust to the Windows team of Microsoft is long gone and going forward I will try to avoid this operating system as much as possible.

__So if you are reading this and know of any non-tech savvy users in your environment, PLEASE, warn them of this feature and help them disable it, when it arrives or even better help them switch to Linux (e.g Linux Mint). And if they answer "I have nothing to hide" they should definitely leave the front door of their house unlocked and open 24/7 as they have nothing to hide anyways.__

> Thanks For Coming To My TED Talk 🙃

## I don't use Arch, btw.

Now, the important question: _What distribution will I be using?_

Many distributions have close to a __religion-like following__ 😶‍🌫️. For me, I wanted an operating system, that __does not stand in my way of doing things__. In the past I looked at _Ubuntu, Fedora and Linux Mint_. With those distros being very mainstream, I read, that there is a minimized chance of missing drivers or incompatibilities 🚀.

I've heard from a few people that they really like the _Gnome window manager_, so I narrowed my selection to Ubuntu and Fedora. I then tried both distros in a virtual machine, which OS fits best to me and finally I stuck with __Ubuntu__ 🎉.

The vanilla Gnome experience in Fedora is nice but I like the custom Gnome and the dock in Ubuntu more.


## Which filesystem is best?

As the standard Windows file system [NTFS](https://en.wikipedia.org/wiki/NTFS) is __proprietary and closed source__, the existing Linux drivers for NTFS are community made and reverse engineered. The implementation is not based on a specification which means that there could be __incompatibilities__ or even __bugs__ 🪲.

Therefore, I went through my hard drives, deleted stuff I didn't need anymore, backed up files I wanted to save and reformated the drives to the [ext4](https://en.wikipedia.org/wiki/Ext4) filesystem.

All of my drives except two. On one SSD, I cloned my Windows system drive, so I can have a dual boot setup if at any point I need to go back to my Windows installation. Additionally, I kept one 1 TB HDD on NTFS for Windows file storage.

That leaves the rest of the drives and my M.2 NVME SSD free for my Ubuntu installation and storage space in __ext4__ 🎈.

## Driver? I hardly know her!

I've heard a lot of horror stories of incompatibilities on Linux with basically everything.

![Linux user sending an email meme](/images/posts/a224cb67-e299-476f-a219-08d2db1d67f4.jpg)

But with current versions of Ubuntu (24.04 LTS) there were basically no problems yet 🗿. My NVIDIA Graphics card and all of my Hardware worked out of the box and installing programs is as easy as on Windows.

Even gaming works better than expected. These last few years, VALVE, the company behind the game platform Steam, invested a lot of time into a compatibility layer called Proton, which lets you play Windows only games on Linux as well.

Of course there is the problem of some other software such as Adobe not being available on Linux. I haven't looked into WINE or Bottles yet, but in an emergency (which hasn't happened yet) I could just boot into Windows for that task. Meanwhile, I started getting used to using [PhotoGIMP](https://github.com/Diolinux/PhotoGIMP) as a replacement for Photoshop.

## Conclusion

I waited a very long time to finally make the switch to Linux Desktop and I'm very happy with how everything works!

I basically have all features I really need for my dev workflows and I'm getting a lot of quality of life improvements, that come with the improved configurations possible on linux.

Finally, even if this post seemed to basically hate on Microsoft, I actually really like the software Microsoft creates - limited to development software, of course.
As is quite obvious, I really love products such as .NET or VSCode and I'm very thankful of the fusion of Xamarin and .NET, that I can still use the .NET and C# ecosystem on Linux to develop my Software.

Aaaaaaand the compulsory neofetch screenshot:
![Neofetch](/images/posts/f1e39ffa-b36f-43ce-b098-5eda9ab293fd.webp)