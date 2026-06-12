# Study Pal

Study Pal helps plan, track, and review progress toward concrete learning outcomes.

## Language

**Study Goal**:
A learning outcome with a clear endpoint that study sessions progress toward over time.
_Avoid_: Subject, topic, category

**Study Area**:
A broad subject used to organize study goals and compare effort across related learning work.
_Avoid_: General topic, category, subject

**Study Session**:
A completed block of focused study time that contributes progress toward exactly one **Study Goal**.
_Avoid_: Sitting, study block, mixed session

**Study Target**:
An optional weekly time or session-count commitment attached to a **Study Goal**.
_Avoid_: Monthly target, daily target, milestone

**Study Priority**:
A relative scheduling weight for a **Study Goal**.
_Avoid_: Importance, urgency, value

**Active Study Goal**:
A **Study Goal** that can receive new **Study Sessions** and be suggested for study.
_Avoid_: Open goal, current goal

**Completed Study Goal**:
A **Study Goal** whose endpoint has been reached and no longer receives new **Study Sessions** unless reopened.
_Avoid_: Archived goal, closed goal

## Relationships

- A **Study Area** can include one or more **Study Goals**.
- A **Study Area** has a unique name to avoid ambiguity in reporting.
- A **Study Goal** belongs to at most one **Study Area** and can be declared without one.
- A **Study Goal** has a unique name to avoid ambiguity in logging, suggestions, and reporting.
- A **Study Goal** can use an outcome-based endpoint without numeric time or session targets.
- A **Study Goal** can have zero or more **Study Targets**.
- A **Study Goal** has one **Study Priority** used when suggesting what to study next.
- A **Study Goal** is either an **Active Study Goal** or a **Completed Study Goal**.
- A **Study Session** belongs to exactly one **Study Goal**.
- An **Active Study Goal** can become a **Completed Study Goal** when the user marks its endpoint reached.
- A **Completed Study Goal** can be reopened into an **Active Study Goal**.
- A **Completed Study Goal** does not receive new **Study Sessions** unless reopened.

## Example dialogue

> **Dev:** "Is 'French' a **Study Goal**?"
> **Domain expert:** "No. French is a **Study Area**. 'Reach B1 French speaking and listening' is a **Study Goal** because it has a concrete endpoint."

> **Dev:** "If I study French for 45 minutes and React for 30 minutes, is that one **Study Session**?"
> **Domain expert:** "No. That is two **Study Sessions** because each contributes to a different **Study Goal**."

> **Dev:** "Is 'study 5 hours this week' the **Study Goal**?"
> **Domain expert:** "No. That is a **Study Target** for a **Study Goal** such as 'Obtain AWS CCP certification'."

> **Dev:** "Does a high **Study Priority** mean the goal is more valuable?"
> **Domain expert:** "No. It means the goal should be suggested more often when planning what to study next."

> **Dev:** "Can I log a new **Study Session** against a **Completed Study Goal**?"
> **Domain expert:** "No. Reopen the goal first, or create a new **Study Goal** if the original endpoint was already reached."

## Flagged ambiguities

- "goal" was initially used near broad subjects such as French, React, and Statistics — resolved: a **Study Goal** must describe a concrete endpoint, while broad subjects are supporting classifications.
- "end" could have implied numeric completion targets — resolved: a **Study Goal** needs an outcome endpoint, not necessarily a time or session count.
- "session" could have meant a whole sitting across multiple goals — resolved: a **Study Session** contributes to exactly one **Study Goal**.
- "general topic" and "category" were both used for broad classification — resolved: **Study Area** is the canonical term.
- "target" could have meant daily, weekly, monthly, lifetime, or custom measurements — resolved: **Study Targets** are optional weekly time or session-count commitments; daily, monthly, and custom targets are avoided for now.
- "priority" could have meant importance, urgency, or value — resolved: **Study Priority** means scheduling weight.
- "streaks" and "rest days" initially seemed useful for gamification — reversed: they add too much friction and are avoided for now.
