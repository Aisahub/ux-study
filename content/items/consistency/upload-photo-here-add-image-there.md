---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    A profile page. Under the avatar sits a filled blue button, "Upload
    photo". Further down, inside the "About you" form, the same action —
    putting a picture on the profile — appears again as a grey text link,
    "Add image". Every other action on this page is a filled blue button
    named verb-plus-noun: "Save changes", "Update email", "Verify number".
    The caption under the avatar reads "Your photo appears next to your
    comments", and the help text at the bottom says "Photos must be under
    5 MB".
  ko: >-
    프로필 페이지입니다. 아바타 아래에는 파란 채움 버튼인 "사진 올리기"
    버튼이 있습니다. 더 내려가면 "자기 소개" 폼 안에, 프로필에 그림을 넣는
    같은 동작이 회색 글자 링크 "이미지 추가"로 다시 나타납니다. 이 페이지의
    다른 동작들은 전부 동사가 붙은 파란 채움 버튼입니다. "변경사항 저장",
    "이메일 갱신", "번호 인증". 아바타 밑 설명문에는 "사진은 댓글 옆에
    표시됩니다"라고, 페이지 맨 아래 도움말에는 "사진은 5MB 이하여야
    합니다"라고 적혀 있습니다.
screen:
  en: |-
    <div class="screen stack">
      <div class="actions">
        <div class="avatar"></div>
        <div>
          <button class="btn btn--blue">Upload photo</button>
          <p class="muted" style="margin:6px 0 0">Your photo appears next to your comments</p>
        </div>
      </div>
      <div>
        <h2>About you</h2>
        <div class="field" style="margin-bottom:10px"><span class="field-label">Display name</span><input class="control" value="Alex Ferrer"></div>
        <div class="field" style="margin-bottom:10px"><span class="field-label">Job title</span><input class="control" value="Operations lead"></div>
        <div class="field" style="margin-bottom:10px"><span class="field-label">Profile picture</span><span class="link--bare" style="color:#6b7280">Add image</span></div>
        <button class="btn btn--blue">Save changes</button>
      </div>
      <div>
        <div class="field" style="margin-bottom:10px"><span class="field-label">Email</span><input class="control" value="alex@example.com"></div>
        <button class="btn btn--blue" style="margin-right:8px">Update email</button>
        <button class="btn btn--blue">Verify number</button>
      </div>
      <p class="muted">Photos must be under 5 MB</p>
    </div>
  ko: |-
    <div class="screen stack">
      <div class="actions">
        <div class="avatar"></div>
        <div>
          <button class="btn btn--blue">사진 올리기</button>
          <p class="muted" style="margin:6px 0 0">사진은 댓글 옆에 표시됩니다</p>
        </div>
      </div>
      <div>
        <h2>자기 소개</h2>
        <div class="field" style="margin-bottom:10px"><span class="field-label">표시 이름</span><input class="control" value="김지우"></div>
        <div class="field" style="margin-bottom:10px"><span class="field-label">직함</span><input class="control" value="운영 리드"></div>
        <div class="field" style="margin-bottom:10px"><span class="field-label">프로필 사진</span><span class="link--bare" style="color:#6b7280">이미지 추가</span></div>
        <button class="btn btn--blue">변경사항 저장</button>
      </div>
      <div>
        <div class="field" style="margin-bottom:10px"><span class="field-label">이메일</span><input class="control" value="jiwoo@example.com"></div>
        <button class="btn btn--blue" style="margin-right:8px">이메일 갱신</button>
        <button class="btn btn--blue">번호 인증</button>
      </div>
      <p class="muted">사진은 5MB 이하여야 합니다</p>
    </div>
prompt:
  en: >-
    The same action appears twice, worded and styled differently. Which
    treatment should both places use?
  ko: >-
    같은 동작이 두 번, 서로 다른 이름과 모양으로 나옵니다. 두 곳을 어느
    쪽으로 맞춰야 할까요?
options:
  en:
    - text: Make both "Upload photo" as a filled blue button
      reason: >-
        The page's other actions all take that form, and its own captions and
        help text already call the thing a photo, never an image.
      correct: true
    - text: Make both "Add image"
      reason: >-
        "Image" covers illustrations and logos as well as photographs, so it is
        the more accurate word for what users might upload.
    - text: Keep both as they are
      reason: >-
        The button serves the avatar and the link serves the form, and two
        entry points to one action can dress for where they live.
    - text: Remove the form's link and keep only the avatar button
      reason: >-
        Then the question of matching them never arises.
  ko:
    - text: 둘 다 파란 채움 버튼의 "사진 올리기"로 맞춥니다
      reason: >-
        이 페이지의 다른 동작이 모두 그 형태이고, 페이지의 설명문과 도움말도
        이미 줄곧 "이미지"가 아니라 "사진"이라고 부르고 있습니다.
      correct: true
    - text: 둘 다 "이미지 추가"로 맞춥니다
      reason: >-
        "이미지"는 사진만 아니라 일러스트와 로고까지 아우르니, 사용자가 올릴
        수 있는 것을 더 정확히 담는 말입니다.
    - text: 지금 그대로 둡니다
      reason: >-
        버튼은 아바타를, 링크는 폼을 섬기는 것이니, 한 동작의 입구가 둘이라면
        각자 놓인 자리에 맞게 차려입어도 됩니다.
    - text: 폼의 링크를 없애고 아바타 버튼만 남깁니다
      reason: >-
        그러면 둘을 맞추는 문제 자체가 생기지 않습니다.
---
