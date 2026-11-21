type AVATAR_STYLE = "adventurer-neutral" | "shape-grid"

export function generateAvatarUrl(seed: string, style: AVATAR_STYLE) {
  const params = new URLSearchParams({
    seed,
  })

  return `https://api.dicebear.com/10.x/${style}/svg?${params.toString()}`
}
