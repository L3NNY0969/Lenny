const { Argument, util: { regExpEsc } } = require("klasa");
const userRegex = Argument.regex.userOrMember;
const { GuildMember, User } = require("discord.js");

function resolveUser(query, guild) {
    if (query instanceof GuildMember) return query.user;
    if (query instanceof User) return query;
    if (typeof query === "string") {
      if (userRegex.test(query)) return guild.client.users.fetch(userRegex.exec(query)[1]).catch(() => null);
      if (/\w{1,32}#\d{4}/.test(query)) {
        const res = guild.members.find(member => member.user.tag === query);
        return res ? res.user : null;
      }
    }
    return null;
  }

class MemberName extends Argument {

    async run(arg, possible, message) {
        if (!message.guild) return this.user(arg, possible, message);
        const resolved = resolveUser(arg, message.guild);
        if (resolved) return resolved;

        const memberResults = [];
        let type = "";
        const memberNameMatch = new RegExp(regExpEsc(arg), "i");
        
        for (const member of message.guild.members.values()) { if (memberNameMatch.test(member.user.username)) memberResults.push(member); }

        if (memberResults.length > 0) {
            const members = memberResults.filter(() => memberNameMatch.test(arg));
            type = members.length < 1 ? "MATCH" : "MULTIPLE";
        } else type = "INVALID";

        switch (type) {
            case "MATCH": return memberResults[0];
            case "MULTIPLE": return this.waitForSelection(message, memberResults);
            case "INVALID": throw message.language.get("RESOLVER_INVALID_MEMBERNAME", possible);
        }
   }

    async waitForSelection(message, results) {
        const result = await message.prompt(message.language.get("RESOLVER_MULTIPLE_MEMBERS", results));
        if (!results.find(res => res.user.username === result.cleanContent)) {
            message.channel.send(message.language.get("RESOLVER_INVALID_MEMBER_CHOICE", result.cleanContent, results));
            return this.waitForSelection(message, results);
        }
        return results.find(res => res.user.username === result.cleanContent);
    }

}

module.exports = MemberName;