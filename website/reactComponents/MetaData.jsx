import React from "react";

const MetaData = ({
    title = "Chat Noir",
    description = "A simple to use discord bot with a TON of features.",
    image = "https://cdn.discordapp.com/avatars/459153545917235200/c588678a9c60e11dcca4c728ebf4ccfe.png?size=2048",
    url = "https://remixbot.ml",
    color = "#1A1210"
}) => (
    <div>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={image}/>
        <meta property="og:url" content={url}/>
        <meta name="theme-color" content={color}/>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </div>
);

export default MetaData;