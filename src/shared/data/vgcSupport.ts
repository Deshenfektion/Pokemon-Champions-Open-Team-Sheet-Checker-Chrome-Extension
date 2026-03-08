// Species that most VGC teams run as dedicated support Pokémon and that
// commonly carry Protect. Used by an optional, purely informational rule.
export const COMMON_VGC_SUPPORT_SPECIES: ReadonlySet<string> = new Set([
  'incineroar',
  'amoonguss',
  'grimmsnarl',
  'indeedee',
  'whimsicott',
  'murkrow',
  'farigiraf',
  'gothitelle',
  'clefairy',
  'clefable',
  'rillaboom',
  'pelipper',
  'torkoal',
  'gastrodon',
  'porygon2',
]);

export const PROTECT_LIKE_MOVES: ReadonlySet<string> = new Set([
  'protect',
  'detect',
  'spikyshield',
  'banefulbunker',
  'burningbulwark',
  'silktrap',
  'kingsshield',
  'obstruct',
]);
