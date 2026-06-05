import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MarkdownMessage from "../components/MarkdownMessage";
import Colors from "../constants/Colors";
const MessageItem = memo(({ item }) => {
  if (item.type === "pet-card") {
    const pet = item.pet;
    return (
      <View style={styles.petCard}>
        {item?.showImage && pet?.imageUrl && (
          <Image source={{ uri: pet.imageUrl }} style={styles.petImageTop} />
        )}
        <View style={styles.petCardContent}>
          <Text style={styles.petName}>{pet.name}</Text>

          <View style={styles.tagsRow}>
            {pet.breed && <View style={styles.tag}><Text style={styles.tagText}>{pet.breed}</Text></View>}
            {pet.category && <View style={styles.tag}><Text style={styles.tagText}>{pet.category}</Text></View>}
            {pet.sex && <View style={styles.tag}><Text style={styles.tagText}>{pet.sex}</Text></View>}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{pet.age ?? "—"}</Text>
              <Text style={styles.statLabel}>yrs old</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{pet.weight ?? "—"}</Text>
              <Text style={styles.statLabel}>kg</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue} numberOfLines={1}>{pet.address?.split(",")[0] ?? "—"}</Text>
              <Text style={styles.statLabel}>location</Text>
            </View>
          </View>

          {pet.about && (
            <View style={styles.aboutBox}>
              <Text style={styles.aboutLabel}>About</Text>
              <Text style={styles.aboutText} numberOfLines={3}>{pet.about}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  const isUser = item.role === "user";
  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && <View style={styles.botDot} />}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {isUser ? (
          <Text style={styles.userText}>{item.text}</Text>
        ) : (
          <MarkdownMessage text={item.text} />
        )}
      </View>
    </View>
  );
}, (prev, next) => prev.item.id === next.item.id);

export default MessageItem;

const styles = StyleSheet.create({
  /* ── Bubble ── */
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  rowUser: {
    flexDirection: "row-reverse",
  },
  botDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "72%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.WHITE,
    borderWidth: 0.5,
    borderColor: "#e8e8e4",
    borderBottomLeftRadius: 4,
  },
  userText: {
    fontSize: 14,
    color: "#1a1a18",
    lineHeight: 21,
  },
  botText: {
    fontSize: 14,
    color: "#1a1a18",
    lineHeight: 21,
  },

  /* ── Pet Card ── */
  petCard: {
    width: "80%",
    alignSelf: "flex-start",
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: '10%',
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e8e8e4",
  },
  petImageTop: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  petCardContent: {
    padding: 14,
  },
  petName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a18",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },

  /* Tags row */
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginBottom: 14,
  },
  tag: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  tagText: {
    fontSize: 11,
    color: Colors.PRIMARY,
    fontWeight: "500",
  },

  /* Stats row */
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a18",
  },
  statLabel: {
    fontSize: 11,
    color: Colors.GRAY,
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: Colors.PRIMARY,
    opacity: 0.4,
    marginVertical: 4,
  },

  /* About */
  aboutBox: {
    backgroundColor: "#fafaf8",
    borderRadius: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#e8e8e4",
  },
  aboutLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.PRIMARY,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  aboutText: {
    fontSize: 13,
    color: Colors.GRAY,
    lineHeight: 19,
  },
});