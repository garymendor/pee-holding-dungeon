Some helpful tips for specifying new events:

- The special status effects `urination` and `defecation` will automatically take care of
  resetting the player's bladder and bowels status, setting the `wet-panties` or `soiled-panties`
  status if appropriate, and then clearing themselves.
- If you wish to write an event where the player uses the toilet or otherwise has their
  panties down, make sure to set `panties` to `false` before setting the `urination` or
  `defecation` statuses, then set `panties` back to `true` afterward (unless your event
  steals their panties). Be careful to only do this if `panties` was already `true` to start
  with, or you might create phantom panties!
